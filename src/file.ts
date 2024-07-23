import { join } from 'path';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';

function getTimes() {
  const lpad = (num: number) => (num > 9 ? '' : '0') + num;
  const d = new Date();
  const times = [
    d.getFullYear(),
    lpad(d.getMonth() + 1),
    lpad(d.getDate()),
    lpad(d.getHours()),
    lpad(d.getMinutes()),
    lpad(d.getSeconds())
  ];

  return times.join('');
}

export function isValidPattern(value: string) {
  return /^[0-9][0-9]{0,13}\.([a-zA-Z0-9\_-]*)\.(up|down)\.(\w+)$/.test(value);
}

export function generate(path: string, name: string, version?: string) {
  if (!/^\d+$/.test(version ?? '')) {
    throw new Error('Version must be a number');
  }

  const _version = version && /^\d+$/.test(version) ? version : getTimes();
  const files = ['up', 'down'].map((v) => `${_version}.${name}.${v}.sql`);
  const targetPath = join(process.cwd(), path);

  if (files.some((f) => !isValidPattern(f))) {
    throw new Error('Failed to generate migration file. File name only contains letter, number, dash & underscore');
  }

  const fileNames = readdirSync(targetPath);
  if (fileNames.some((f) => f.startsWith(_version))) {
    throw new Error('Version already exists');
  }

  for (let i = 0; i < files.length; i++) {
    writeFileSync(join(targetPath, files[i]), '', { encoding: 'utf-8' });
    console.info(`Successfully generate ${files[i]}`);
  }
}

export function parseFileName(fileName: string) {
  if (!isValidPattern(fileName)) {
    return;
  }

  const [version, name, type] = fileName.split('.');

  return { version, name, type };
}

export function readFiles(cwd: string, type: 'up' | 'down') {
  const fileNames = readdirSync(cwd).filter((f) => parseFileName(f)?.type === type);
  const files = fileNames.map((f) => ({
    name: f,
    stat: statSync(join(cwd, f)),
    version: parseFileName(f)?.version as string,
    content: readFileSync(join(cwd, f)).toString('utf-8').trim()
  }));

  return files.filter((f) => f.content !== '');
}
