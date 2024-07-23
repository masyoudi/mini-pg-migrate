import { join } from 'path';
import { loadConfig, loadDotenv } from 'c12';

export type DBConfig = {
  dbuser: string;
  dbhost: string;
  dbport: number;
  dbpassword: string;
  dbname: string;
  dbstmttimeout: number;
  dbquerytimeout: number;
  dblocktimeout: number;
  dbappname: string;
  dbconntimeoutmillis: number;
  dbiddleintrxsesstimeout: number;
};

const CONFIG: Record<keyof DBConfig, any> = {
  dbuser: undefined,
  dbhost: 'localhost',
  dbport: 5432,
  dbpassword: undefined,
  dbname: undefined,
  dbstmttimeout: undefined,
  dbquerytimeout: undefined,
  dblocktimeout: undefined,
  dbappname: undefined,
  dbconntimeoutmillis: undefined,
  dbiddleintrxsesstimeout: undefined
};

function parse(value: any, defaults?: any) {
  if (typeof defaults === 'undefined') {
    return value ?? defaults;
  }

  if (typeof defaults === 'number') {
    return parseInt(value ?? defaults);
  }

  return String(value ?? defaults);
}

export function transform(env: any) {
  const result = Object.keys(CONFIG).reduce((prev: any, key) => {
    const value = parse(env?.[key] ?? env?.[key.toUpperCase()], CONFIG[key as keyof DBConfig]);
    if (typeof value !== 'undefined') {
      prev[key] = value;
    }

    return prev;
  }, {});

  return Object.keys(result).length > 0 ? (result as DBConfig) : undefined;
}

export async function resolveConfig(path: string) {
  const paths = path.split('/');
  const fileName = paths[paths.length - 1];
  const isDotenv = fileName === '.env';
  const suffix = paths.slice(0, path.split('/').length - 1).join('/');
  const cwd = join(process.cwd(), suffix);

  if (isDotenv) {
    const env = await loadDotenv({ cwd, fileName });
    return transform(env);
  }

  const { config } = await loadConfig({
    cwd,
    packageJson: false,
    configFile: fileName,
    rcFile: false
  });

  return transform(config);
}
