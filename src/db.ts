import * as pg from 'pg';
import type { DBConfig } from './config';

type MigrationFile = {
  name: string;
  version: string;
  content: string;
};

const { Pool } = pg;
const migrationTable = 'migrations_schema';

function splitStr(str: string, char: string = ';') {
  return str.replace(/\r?\n|\r/g, '').split(char);
}

export async function setupPool(config: DBConfig) {
  const pool = new Pool({
    host: config.dbhost,
    port: config.dbport,
    user: config.dbuser,
    database: config.dbname,
    password: config.dbpassword,
    statement_timeout: config.dbstmttimeout,
    query_timeout: config.dbquerytimeout,
    ...({ lock_timeout: config.dblocktimeout } as any),
    application_name: config.dbappname,
    connectionTimeoutMillis: config.dbconntimeoutmillis,
    idle_in_transaction_session_timeout: config.dbiddleintrxsesstimeout
  });

  const client = await pool.connect();
  const { schema } = (await client.query('SELECT CURRENT_SCHEMA() as schema')).rows?.[0];
  await ensureVersionTable(client, schema);
  client.release();

  return { pool, schema, migrationTable };
}

async function ensureVersionTable(client: pg.PoolClient, schema: string) {
  const select = `
    SELECT COUNT(1)::int AS count
    FROM information_schema.tables
    WHERE table_schema = $1
    AND table_name = $2 LIMIT 1
  `;

  const result = await client.query({
    text: select,
    values: [schema, migrationTable]
  });
  const { count } = result.rows[0];

  if (count === 1) {
    return;
  }

  const create = `
    CREATE TABLE IF NOT EXISTS ${schema}.${migrationTable} (
      version varchar NOT NULL PRIMARY KEY,
      created_at timestamptz DEFAULT CURRENT_TIMESTAMP
    )  
  `;

  await client.query(create);
}

export async function checkVersion(client: pg.PoolClient, version: string) {
  const result = await client.query({
    text: `SELECT version FROM ${migrationTable} WHERE version = $1`,
    values: [version]
  });

  return result.rowCount === 1;
}

export async function setVersion(client: pg.PoolClient, version: string) {
  await client.query({
    text: `INSERT INTO ${migrationTable} (version) VALUES ($1)`,
    values: [version]
  });
}

export async function removeVersion(client: pg.PoolClient, version: string) {
  await client.query({
    text: `DELETE FROM ${migrationTable} WHERE version = $1`,
    values: [version]
  });
}

export async function getVersions(pool: pg.Pool) {
  const client = await pool.connect();
  const { rows } = await client.query(`SELECT version FROM ${migrationTable} ORDER BY created_at DESC`);
  client.release();

  return rows.map((v) => String(v.version));
}

export async function migrate(pool: pg.Pool, file: MigrationFile, type: 'up' | 'down', force: boolean = false) {
  const client = await pool.connect();
  let success = false;
  try {
    await client.query('BEGIN');
    const isExists = await checkVersion(client, file.version);

    if ((!isExists || force) && type === 'up') {
      await Promise.all(splitStr(file.content).map((text) => client.query(text)));
      await setVersion(client, file.version);
    }

    if ((isExists || force) && type === 'down') {
      await Promise.all(splitStr(file.content).map((text) => client.query(text)));
      await removeVersion(client, file.version);
    }

    await client.query('COMMIT');
    console.info('Processed migration ' + file.name);
    success = true;
  } catch (err: any) {
    console.error('[ERROR]', err.message);
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }

  return { success };
}
