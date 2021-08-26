import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

/* #07-06 */
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {
    /* db file might not exist; don't care */
  }
});

/* #07-07 */
global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
});
