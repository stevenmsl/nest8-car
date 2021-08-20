import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/* #05-01
  - compatibility issue; need to use require
*/
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* #05-02 */
  app.use(
    cookieSession({
      keys: ['arlothepet'],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      /* #03-07 */
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
