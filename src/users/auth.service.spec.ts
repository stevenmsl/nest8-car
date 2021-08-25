import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  /* #06-02
    - use Partial as you don't want to implement
      every single methods in UsersService; just
      enough to get the testing going
  */
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    /* #06-01
      - provide a default mock service before
        each unit test runs
      - you can override the implementation 
        of the methods in each unit test
        if needed 
    */
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    /* #06-03
      - create DI container for testing purpose
    */
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          /* #06-04
            - whenever UsersService is needed
              use fakeUsersService instead     
          */
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  /* 
    - simple test to make sure DI work
  */
  it('can create an instance of auth', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hased password', async () => {
    const user = await service.signup('arlo@arlo.com', 'arlothepet');
    /* #06-05
      - the password will be salted and hashed
      - the best we can do is to make sure it 
        will be different from the original 
        password as we don't know what the
        salt might be  
    */
    expect(user.password).not.toEqual('arlothepet');
    const [salt, password] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(password).toBeDefined();
  });

  /* #06-06 */
  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin('arlo@arlo.com', 'arlothepet');
    } catch (err) {
      expect((err as NotFoundException).message).toEqual('user not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('arlo@arlo.com', 'arlothepet');
    try {
      await service.signin('arlo@arlo.com', 'password');
    } catch (err) {
      expect((err as BadRequestException).message).toEqual('bad password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('arlo@arlo.com', 'arlothepet');

    const user = await service.signin('arlo@arlo.com', 'arlothepet');
    expect(user).toBeDefined();
  });
});
