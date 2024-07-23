import { defineCommand } from 'citty';
import { setupPool, migrate } from '../../db';
import setup from '../../index';

const MIGRATION_TYPE = 'up';

export default defineCommand({
  meta: {
    name: 'migrate:up',
    description: 'Database migration up'
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

      for (let i = 0; i < files.length; i++) {
        await migrate(pool, files[i], MIGRATION_TYPE, args.force === 'force');
      }

      await pool?.end();
    } catch (err: any) {
      console.error('[ERROR]', err.message, err.stack);
    }
  }
});
