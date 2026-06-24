import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AssetsService } from './assets.service';

describe('AssetsService', () => {
  let service: AssetsService;

  const prismaServiceMock = {
    brandProject: {
      findFirst: jest.fn(),
    },
    visualAsset: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const storageServiceMock = {
    buildFileMetadata: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: StorageService,
          useValue: storageServiceMock,
        },
      ],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an asset when the project belongs to the authenticated user', async () => {
    prismaServiceMock.brandProject.findFirst.mockResolvedValue({
      id: 'project-1',
    });
    prismaServiceMock.visualAsset.create.mockResolvedValue({
      id: 'asset-1',
    });

    const result = await service.create(
      'project-1',
      {
        name: 'Logo Principal',
        assetType: 'LOGO',
        fileUrl: 'https://cdn.letzify.dev/assets/logo.svg',
        fileKey: 'projects/project-1/logo.svg',
        mimeType: 'image/svg+xml',
        fileSizeBytes: 2048,
        checksumSha256:
          '3f786850e387550fdab836ed7e6dc881de23001b86c8e6f89b9f8f0f2c8f4f12',
      },
      'owner-1',
    );

    expect(prismaServiceMock.brandProject.findFirst).toHaveBeenCalledWith({
      where: { id: 'project-1', ownerId: 'owner-1' },
    });
    expect(prismaServiceMock.visualAsset.create).toHaveBeenCalledWith({
      data: {
        projectId: 'project-1',
        uploadedById: 'owner-1',
        name: 'Logo Principal',
        assetType: 'LOGO',
        fileUrl: 'https://cdn.letzify.dev/assets/logo.svg',
        fileKey: 'projects/project-1/logo.svg',
        mimeType: 'image/svg+xml',
        fileSizeBytes: 2048,
        checksumSha256:
          '3f786850e387550fdab836ed7e6dc881de23001b86c8e6f89b9f8f0f2c8f4f12',
      },
    });
    expect(result).toEqual({ id: 'asset-1' });
  });

  it('should normalize optional fields to null when creating an asset', async () => {
    prismaServiceMock.brandProject.findFirst.mockResolvedValue({
      id: 'project-1',
    });
    prismaServiceMock.visualAsset.create.mockResolvedValue({
      id: 'asset-1',
    });

    await service.create(
      'project-1',
      {
        name: 'Guideline PDF',
        assetType: 'DOCUMENT',
        fileUrl: 'https://cdn.letzify.dev/assets/guide.pdf',
        fileKey: 'projects/project-1/guide.pdf',
      },
      'owner-1',
    );

    expect(prismaServiceMock.visualAsset.create).toHaveBeenCalledWith({
      data: {
        projectId: 'project-1',
        uploadedById: 'owner-1',
        name: 'Guideline PDF',
        assetType: 'DOCUMENT',
        fileUrl: 'https://cdn.letzify.dev/assets/guide.pdf',
        fileKey: 'projects/project-1/guide.pdf',
        mimeType: null,
        fileSizeBytes: null,
        checksumSha256: null,
      },
    });
  });

  it('should throw NotFoundException when the project does not belong to the authenticated user', async () => {
    prismaServiceMock.brandProject.findFirst.mockResolvedValue(null);

    await expect(
      service.create(
        'project-1',
        {
          name: 'Logo Principal',
          assetType: 'LOGO',
          fileUrl: 'https://cdn.letzify.dev/assets/logo.svg',
          fileKey: 'projects/project-1/logo.svg',
        },
        'owner-1',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should list assets for a project owned by the authenticated user', async () => {
    prismaServiceMock.brandProject.findFirst.mockResolvedValue({
      id: 'project-1',
    });
    prismaServiceMock.visualAsset.findMany.mockResolvedValue([
      { id: 'asset-1' },
    ]);

    const result = await service.findAllByProject('project-1', 'owner-1');

    expect(prismaServiceMock.visualAsset.findMany).toHaveBeenCalledWith({
      where: { projectId: 'project-1' },
      orderBy: { createdAt: 'asc' },
    });
    expect(result).toEqual([{ id: 'asset-1' }]);
  });

  it('should find an asset owned through the project relation', async () => {
    prismaServiceMock.visualAsset.findFirst.mockResolvedValue({
      id: 'asset-1',
    });

    const result = await service.findOne('project-1', 'asset-1', 'owner-1');

    expect(prismaServiceMock.visualAsset.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'asset-1',
        projectId: 'project-1',
        project: { is: { ownerId: 'owner-1' } },
      },
    });
    expect(result).toEqual({ id: 'asset-1' });
  });

  it('should throw NotFoundException when an asset does not exist for the project ownership', async () => {
    prismaServiceMock.visualAsset.findFirst.mockResolvedValue(null);

    await expect(
      service.findOne('project-1', 'asset-1', 'owner-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should update only provided fields after confirming ownership', async () => {
    prismaServiceMock.visualAsset.findFirst.mockResolvedValue({
      id: 'asset-1',
      projectId: 'project-1',
    });
    prismaServiceMock.visualAsset.update.mockResolvedValue({
      id: 'asset-1',
      name: 'Logo Secundaria',
    });

    const result = await service.update(
      'project-1',
      'asset-1',
      {
        name: 'Logo Secundaria',
        fileUrl: 'https://cdn.letzify.dev/assets/logo-secondary.svg',
      },
      'owner-1',
    );

    expect(prismaServiceMock.visualAsset.update).toHaveBeenCalledWith({
      where: { id: 'asset-1' },
      data: {
        name: 'Logo Secundaria',
        fileUrl: 'https://cdn.letzify.dev/assets/logo-secondary.svg',
      },
    });
    expect(result).toEqual({ id: 'asset-1', name: 'Logo Secundaria' });
  });

  it('should remove an asset after confirming ownership', async () => {
    prismaServiceMock.visualAsset.findFirst.mockResolvedValue({
      id: 'asset-1',
      fileKey: 'project-1/file.svg',
    });
    prismaServiceMock.visualAsset.delete.mockResolvedValue({
      id: 'asset-1',
    });

    await service.remove('project-1', 'asset-1', 'owner-1');

    expect(prismaServiceMock.visualAsset.delete).toHaveBeenCalledWith({
      where: { id: 'asset-1' },
    });
    expect(storageServiceMock.deleteFile).toHaveBeenCalledWith('project-1/file.svg');
  });
});
