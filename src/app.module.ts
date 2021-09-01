import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
/* #05-01
  - compatibility issue; need to use require
*/
const cookieSession = require('cookie-session');

@Module({
  imports: [
    /* #07-04 */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    /* #11-07 */
    TypeOrmModule.forRoot(),
    /* #07-05 */
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_Name'),
    //       /* #03-03 */
    //       entities: [User, Report],
    //       /*
    //         - this will automatically apply
    //           the schema changes to the db
    //         - only use this while in development
    //       */
    //       synchronize: true,
    //     };
    //   },
    // }),
    UsersModule,
    ReportsModule,
  ],
  providers: [
    /* #07-03 */
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        /* #03-07 */
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  /* #07-01 */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        /* #05-02 */
        cookieSession({
          /* #11-01 */
          keys: [this.configService.get<string>('COOKIE_KEY')],
        }),
      )
      /* #07-02 */
      .forRoutes('*');
  }
}
