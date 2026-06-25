import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const prismaServiceMock = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should return the authenticated user without passwordHash', async () => {
    prismaServiceMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'designer@letzify.com',
      name: 'Designer',
      isActive: true,
      roles: ['USER'],
      createdAt: new Date('2026-06-03T10:15:30.000Z'),
      updatedAt: new Date('2026-06-03T10:15:30.000Z'),
    });

    const result = await service.getMe('user-1');

    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-1',
        email: 'designer@letzify.com',
        name: 'Designer',
      }),
    );
    expect(result).not.toHaveProperty('passwordHash');
  });
});
