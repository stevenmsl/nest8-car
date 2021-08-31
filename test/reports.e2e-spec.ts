import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import exp from 'constants';

describe('reports', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /* #10-04 
     - sign up a user and get the cookie
     - create 3 reports and then approve them
     - the estimate should be the average price  
       of the three reports  
  */
  it('gets an estimate', async () => {
    let res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'arlo2@arlo.com', password: 'arlothepet' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    res = await request(app.getHttpServer())
      .post('/reports')
      .send({
        make: 'Infiniti',
        model: 'G37x',
        year: 2010,
        mileage: 160000,
        lng: 0,
        lat: 0,
        price: 10000,
      })
      .set('Cookie', cookie)
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/reports/${res.body.id}`)
      .send({ approved: true })
      .set('Cookie', cookie)
      .expect(200);

    res = await request(app.getHttpServer())
      .post('/reports')
      .send({
        make: 'Infiniti',
        model: 'G37x',
        year: 2010,
        mileage: 160000,
        lng: 0,
        lat: 0,
        price: 20000,
      })
      .set('Cookie', cookie)
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/reports/${res.body.id}`)
      .send({ approved: true })
      .set('Cookie', cookie)
      .expect(200);

    res = await request(app.getHttpServer())
      .post('/reports')
      .send({
        make: 'Infiniti',
        model: 'G37x',
        year: 2010,
        mileage: 160000,
        lng: 0,
        lat: 0,
        price: 30000,
      })
      .set('Cookie', cookie)
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/reports/${res.body.id}`)
      .send({ approved: true })
      .set('Cookie', cookie)
      .expect(200);

    const {
      body: { price },
    } = await request(app.getHttpServer())
      .get(
        '/reports?make=Infiniti&model=G37x&lng=0&lat=0&mileage=160000&year=2010',
      )
      .send()
      .set('Cookie', cookie);

    expect(price).toEqual(20000);
  });
});
