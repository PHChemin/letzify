import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TypographiesService } from './typographies.service';

describe('TypographiesService', () => {
  let service: TypographiesService;

  const prismaServiceMock = {
    brandProject: {
      findFirst: jest.fn(),
    },
    typography: {
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
        TypographiesService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<TypographiesService>(TypographiesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a typography when the project belongs to the authenticated user', async () => {
    prismaServiceMock.brandProject.findFirst.mockResolvedValue({
      id: 'project-1',
    });
    prismaServiceMock.typography.create.mockResolvedValue({
      id: 'typography-1',
    });

    const result = await service.create(
      'project-1',
      {
        name: 'Inter',
        fontFamily: 'Inter',
        provider: 'Google Fonts',
        category: 'sans-serif',
        weightMin: 400,
        weightMax: 700,
      } as any,
      'owner-1',
    );

    expect(prismaServiceMock.brandProject.findFirst).toHaveBeenCalledWith({
      where: { id: 'project-1', ownerId: 'owner-1' },
    });
    expect(prismaServiceMock.typography.create).toHaveBeenCalledWith({
      data: {
        projectId: 'project-1',
        name: 'Inter',
        fontFamily: 'Inter',
        provider: 'Google Fonts',
        category: 'sans-serif',
        weightMin: 400,
        weightMax: 700,
      },
    });
    expect(result).toEqual({ id: 'typography-1' });
  });

  it('should throw NotFoundException when the owned project does not exist', async () => {
    prismaServiceMock.brandProject.findFirst.mockResolvedValue(null);

    await expect(
      service.create(
        'project-1',
        {
          name: 'Inter',
          fontFamily: 'Inter',
          provider: 'Google Fonts',
        } as any,
        'owner-1',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should list typographies for a project owned by the authenticated user', async () => {
    prismaServiceMock.brandProject.findFirst.mockResolvedValue({
      id: 'project-1',
    });
    prismaServiceMock.typography.findMany.mockResolvedValue([
      { id: 'typography-1' },
    ]);

    const result = await service.findAllByProject('project-1', 'owner-1');

    expect(prismaServiceMock.typography.findMany).toHaveBeenCalledWith({
      where: { projectId: 'project-1' },
      orderBy: { createdAt: 'asc' },
    });
    expect(result).toEqual([{ id: 'typography-1' }]);
  });

  it('should find a typography owned through the project relation', async () => {
    prismaServiceMock.typography.findFirst.mockResolvedValue({
      id: 'typography-1',
    });

    const result = await service.findOne(
      'project-1',
      'typography-1',
      'owner-1',
    );

    expect(prismaServiceMock.typography.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'typography-1',
        projectId: 'project-1',
        project: { is: { ownerId: 'owner-1' } },
      },
    });
    expect(result).toEqual({ id: 'typography-1' });
  });

  it('should update a typography only after ownership is confirmed', async () => {
    prismaServiceMock.typography.findFirst.mockResolvedValue({
      id: 'typography-1',
    });
    prismaServiceMock.typography.update.mockResolvedValue({
      id: 'typography-1',
      name: 'Inter Display',
    });

    const result = await service.update(
      'project-1',
      'typography-1',
      {
        name: 'Inter Display',
        fontFamily: 'Inter Display',
        provider: 'Google Fonts',
        category: 'sans-serif',
        weightMin: 300,
        weightMax: 900,
      } as any,
      'owner-1',
    );

    expect(prismaServiceMock.typography.update).toHaveBeenCalledWith({
      where: { id: 'typography-1' },
      data: {
        name: 'Inter Display',
        fontFamily: 'Inter Display',
        provider: 'Google Fonts',
        category: 'sans-serif',
        weightMin: 300,
        weightMax: 900,
      },
    });
    expect(result).toEqual({ id: 'typography-1', name: 'Inter Display' });
  });

  it('should remove a typography after confirming ownership', async () => {
    prismaServiceMock.typography.findFirst.mockResolvedValue({
      id: 'typography-1',
    });
    prismaServiceMock.typography.delete.mockResolvedValue({
      id: 'typography-1',
    });

    await service.remove('project-1', 'typography-1', 'owner-1');

    expect(prismaServiceMock.typography.delete).toHaveBeenCalledWith({
      where: { id: 'typography-1' },
    });
  });
});
