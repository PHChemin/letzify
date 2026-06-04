import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { PaletteService } from './palette.service';

describe('PaletteService', () => {
  let service: PaletteService;
  const prismaServiceMock = {
    brandProject: { findFirst: jest.fn() },
    colorPalette: {
      updateMany: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaletteService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<PaletteService>(PaletteService);
    jest.clearAllMocks();
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('should create a palette when project exists and owner matches', async () => {
    prismaServiceMock.brandProject.findFirst.mockResolvedValue({
      id: 'project-1',
    });
    prismaServiceMock.colorPalette.create.mockResolvedValue({
      id: 'palette-1',
    });

    const result = await service.create(
      'project-1',
      { name: 'Main', description: 'desc', isPrimary: true } as any,
      'owner-1',
    );

    expect(prismaServiceMock.brandProject.findFirst).toHaveBeenCalledWith({
      where: { id: 'project-1', ownerId: 'owner-1' },
    });
    expect(result).toEqual({ id: 'palette-1' });
  });

  it('should throw NotFoundException when project not found on create', async () => {
    prismaServiceMock.brandProject.findFirst.mockResolvedValue(null);
    await expect(
      service.create('project-1', { name: 'Main' } as any, 'owner-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should find a palette owned by the user', async () => {
    prismaServiceMock.colorPalette.findFirst.mockResolvedValue({
      id: 'palette-1',
    });
    const result = await service.findOne('palette-1', 'owner-1');
    expect(prismaServiceMock.colorPalette.findFirst).toHaveBeenCalledWith({
      where: { id: 'palette-1', project: { is: { ownerId: 'owner-1' } } },
    });
    expect(result).toEqual({ id: 'palette-1' });
  });
});
