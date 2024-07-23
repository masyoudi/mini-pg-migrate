import { expect, expectTypeOf, it, describe } from 'vitest';
import { generate, isValidPattern, parseFileName } from '../src/file';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const migrations = '/test/db/migrations';

const files = ['20240723155029.create_users.up.sql', '20240723155029.create_users.down.sql'];

const isFilesExists = (fileNames: string[]) => fileNames.every((f) => existsSync(join(process.cwd(), migrations, f)));

describe('generate()', () => {
  it('should generate migration files', () => {
    if (isFilesExists(files)) {
      files.map((f) => rmSync(join(process.cwd(), migrations, f)));
    }

    generate(migrations, 'create_users', '20240723155029');
    expectTypeOf(() => generate(migrations, 'create_users', '20240723155029')).returns.toBeVoid();
    expect(isFilesExists(files)).toBe(true);
  });

  it('should not generate migration files', () => {
    expect(() => generate(migrations, 'create_roles', '20240723155029d')).toThrowError('number');
    expect(isFilesExists(['20240723155029d.create_roles.up.sql', '20240723155029d.create_roles.down.sql'])).toBe(false);
  });
});

describe('isValidPattern()', () => {
  it('should be valid pattern', () => {
    expect(files.every((f) => isValidPattern(f))).toBe(true);
  });

  it('should not valid pattern', () => {
    expect(isValidPattern('20240723155029d.create_users.up.sql')).toBe(false);
  });
});

describe('parseFileName()', () => {
  it('should return the same array', () => {
    expect(files.map((f) => parseFileName(f))).toEqual([
      {
        version: '20240723155029',
        name: 'create_users',
        type: 'up'
      },
      {
        version: '20240723155029',
        name: 'create_users',
        type: 'down'
      }
    ]);
  });

  it('should return undefined if input incorrect', () => {
    expect(parseFileName('test')).toBeUndefined();
  });
});
