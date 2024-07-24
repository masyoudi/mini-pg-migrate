import { defineCommand } from 'citty';
import { setupPool, migrate, getVersions } from '../../db';
import setup from '../../setup';

const MIGRATION_TYPE = 'down';

export default defineCommand({
  meta: {
    name: 'migrate:down',
    description: 'Database migration down'
  },
  args: {
    config: {
      type: 'positional',
      description: 'Database config file',
      required: true
    },
    path: {
      type: 'positional',
      description: 'Migration file path',
      required: true
    },
    force: {
      type: 'positional',
      description: 'Force migration',
      required: false
    }
  },
  setup() {
    console.info('Migration start');
  },
  cleanup() {
    console.info('Migration end');
  },
  async run({ args }) {
    try {
      const { files, config } = await setup(args.config, args.path, MIGRATION_TYPE);

      if (!files.length) {
        console.log('No migration executed');
        return;
      }

      const { pool, schema } = await setupPool(config);
      if (!pool || !schema) {
        throw new Error('Failed connect to database ' + config.dbname);
      }

      const versions = await getVersions(pool);
      const _files = versions
        .map((version) => files[files.findIndex((v) => v.version === version)])
        .filter((v) => typeof v !== 'undefined');

      for (let i = 0; i < _files.length; i++) {
        await migrate(pool, _files[i], MIGRATION_TYPE, args.force === 'force');
      }

      await pool?.end();
    } catch (err: any) {
      console.error('[ERROR]', err.message);
    }
  }
});
