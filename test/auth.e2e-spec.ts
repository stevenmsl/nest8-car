import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { emitKeypressEvents } from 'node:readline';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    /* #07-08 */
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'arlo@arlo.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'arlothepet' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('', async () => {
    const email = 'arlo@arlo.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'arlothepet' })
      .expect(201);

    /* #07-09 */
    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
