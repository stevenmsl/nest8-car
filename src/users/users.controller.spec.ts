import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'arlo@arlo.com',
          password: 'arlothepet',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'password' } as User,
        ]);
      },
    };

    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  /* #06-07 
     - you can instantiate the service fine 
       meaning DI is configured properly
  */

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('arlo@arlo.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('arlo@arlo.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    /* #06-08
     - redefine the fineOne method in the fakeUsersService
       so it will always return null 
    */

    fakeUsersService.findOne = () => null;

    try {
      await controller.findUser('1');
    } catch (err) {
      expect((err as NotFoundException).message).toEqual('user not found');
    }
  });

  it('signin updates session object and returns user', async () => {
    /* #06-09 */
    const session = { userId: -1 };
    const user = await controller.signin(
      { email: 'arlo@arlo.com', password: 'arlothepet' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
