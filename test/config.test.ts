import { expect, it, describe } from 'vitest';
import { resolveConfig } from '../src/config';

describe('resolveConfig()', () => {
  it('should return the same object', async () => {
    const config = await resolveConfig('/test/db/config/db.json');

    expect(config).toMatchObject({
      dbuser: 'postgres',
      dbpassword: '',
      dbhost: 'localhost',
      dbport: 5432,
      dbname: 'mini_pg_migrate'
    });
  });
});
