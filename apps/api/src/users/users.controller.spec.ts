import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    getMe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should return the authenticated user profile', async () => {
    usersServiceMock.getMe.mockResolvedValue({
      id: 'user-1',
      email: 'designer@letzify.com',
    });

    const result = await controller.me({ user: { id: 'user-1' } } as any);

    expect(usersServiceMock.getMe).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ id: 'user-1', email: 'designer@letzify.com' });
  });
});
