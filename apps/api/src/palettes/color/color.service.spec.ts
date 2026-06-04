import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ColorService } from './color.service';

describe('ColorService', () => {
  let service: ColorService;
  const prismaServiceMock = {
    paletteColor: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    colorPalette: { findFirst: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColorService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();
    service = module.get<ColorService>(ColorService);
    jest.clearAllMocks();
  });

  it('should list colors ordered by sortOrder for an owned palette', async () => {
    prismaServiceMock.colorPalette.findFirst.mockResolvedValue({
      id: 'palette-1',
    });
    prismaServiceMock.paletteColor.findMany.mockResolvedValue([
      { id: 'color-1', sortOrder: 1 },
    ]);
    await service.findAll('palette-1', 'owner-1');
    expect(prismaServiceMock.paletteColor.findMany).toHaveBeenCalledWith({
      where: { paletteId: 'palette-1' },
      orderBy: { sortOrder: 'asc' },
    });
  });

  it('should throw when palette is not owned by the user', async () => {
    prismaServiceMock.colorPalette.findFirst.mockResolvedValue(null);
    await expect(
      service.findAll('palette-1', 'owner-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
