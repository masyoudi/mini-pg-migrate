import { expect, it, describe } from 'vitest';
import setup from '../src/setup';

describe('setup()', () => {
  it('should return object', async () => {
    expect(await setup('/test/db/config/.env', '/test/db/migrations', 'up')).toEqual({
      config: expect.objectContaining({
        dbuser: 'postgres',
        dbpassword: '',
        dbport: 5432,
        dbhost: 'localhost',
        dbname: 'mini_pg_migrate'
      }),
      files: []
    });
  });
});
