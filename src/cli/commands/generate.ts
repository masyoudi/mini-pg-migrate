import { defineCommand } from 'citty';
import { generate } from '../../file';

export default defineCommand({
  meta: {
    name: 'generate',
    description: 'Generate migration file'
  },
  args: {
    name: {
      type: 'positional',
      description: 'Name of migration file',
      required: true
    },
    path: {
      type: 'positional',
      description: 'Target directory',
      required: true
    },
    version: {
      type: 'positional',
      description: 'Version of migration file',
      required: false
    }
  },
  run({ args }) {
    try {
      generate(args.path, args.name, args.version);
    } catch (err: any) {
      console.error('[ERROR]', err.message);
      process.exit(1);
    }
  }
});
