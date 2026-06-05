import { Test, TestingModule } from '@nestjs/testing';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';

describe('AssetsController', () => {
  let controller: AssetsController;

  const assetsServiceMock = {
    create: jest.fn(),
    findAllByProject: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        {
          provide: AssetsService,
          useValue: assetsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AssetsController>(AssetsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate create requests with the authenticated user id', async () => {
    const request = { user: { id: 'user-1' } } as any;
    const dto: CreateAssetDto = {
      name: 'Logo Principal',
      assetType: 'LOGO',
      fileUrl: 'https://cdn.letzify.dev/assets/logo.svg',
      fileKey: 'projects/project-1/logo.svg',
      mimeType: 'image/svg+xml',
      fileSizeBytes: 2048,
      checksumSha256:
        '3f786850e387550fdab836ed7e6dc881de23001b86c8e6f89b9f8f0f2c8f4f12',
    };

    assetsServiceMock.create.mockResolvedValue({ id: 'asset-1' });

    await controller.create(request, 'project-1', dto);

    expect(assetsServiceMock.create).toHaveBeenCalledWith(
      'project-1',
      dto,
      'user-1',
    );
  });

  it('should delegate listing requests with the authenticated user id', async () => {
    const request = { user: { id: 'user-1' } } as any;

    await controller.findAll(request, 'project-1');

    expect(assetsServiceMock.findAllByProject).toHaveBeenCalledWith(
      'project-1',
      'user-1',
    );
  });

  it('should delegate get by id requests with the authenticated user id', async () => {
    const request = { user: { id: 'user-1' } } as any;

    await controller.findOne(request, 'project-1', 'asset-1');

    expect(assetsServiceMock.findOne).toHaveBeenCalledWith(
      'project-1',
      'asset-1',
      'user-1',
    );
  });

  it('should delegate update requests with the authenticated user id', async () => {
    const request = { user: { id: 'user-1' } } as any;
    const dto = {
      name: 'Logo Secundaria',
      fileUrl: 'https://cdn.letzify.dev/assets/logo-secondary.svg',
    };

    await controller.update(request, 'project-1', 'asset-1', dto);

    expect(assetsServiceMock.update).toHaveBeenCalledWith(
      'project-1',
      'asset-1',
      dto,
      'user-1',
    );
  });

  it('should delegate remove requests with the authenticated user id', async () => {
    const request = { user: { id: 'user-1' } } as any;

    await controller.remove(request, 'project-1', 'asset-1');

    expect(assetsServiceMock.remove).toHaveBeenCalledWith(
      'project-1',
      'asset-1',
      'user-1',
    );
  });
});
