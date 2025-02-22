import { defineCommand } from 'citty';
import generate from './commands/generate';
import migrateDown from './commands/migrate-down';
import migrateUp from './commands/migrate-up';

export default defineCommand({
  meta: {
    name: 'mini-pg-migrate',
    description: 'PostgreSQL database migrator'
  },
  subCommands: {
    generate,
    'migrate:down': migrateDown,
    'migrate:up': migrateUp
  }
});
