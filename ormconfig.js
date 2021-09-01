var dbConfig = {
  /* #11-02 */
  synchronize: false,
  migrations: ['migrations/*.js'],
  /* #11-03 */
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      /* #11-04 */
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      /* #11-05 */
      entities: ['**/*.entity.ts'],
      /* #11-06 */
      migrationsRun: true,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = dbConfig;
