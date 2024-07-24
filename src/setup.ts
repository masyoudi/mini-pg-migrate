import { resolveConfig } from './config';
import { join } from 'path';
import { readFiles } from './file';

export default async function setup(configPath: string, migrationPath: string, type: 'up' | 'down') {
  const config = await resolveConfig(configPath);

  if (!config) {
    throw new Error('Invalid config file');
  }

  const path = join(process.cwd(), migrationPath);
  const files = readFiles(path, type);

  return { config, files };
}
