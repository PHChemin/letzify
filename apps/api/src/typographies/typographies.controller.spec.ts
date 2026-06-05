import { Test, TestingModule } from '@nestjs/testing';
import { CreateTypographyDto } from './dto/create-typography.dto';
import { TypographiesController } from './typographies.controller';
import { TypographiesService } from './typographies.service';

describe('TypographiesController', () => {
  let controller: TypographiesController;

  const typographiesServiceMock = {
    create: jest.fn(),
    findAllByProject: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypographiesController],
      providers: [
        {
          provide: TypographiesService,
          useValue: typographiesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<TypographiesController>(TypographiesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate create requests with the authenticated user id', async () => {
    const request = { user: { id: 'user-1' } } as any;
    const dto: CreateTypographyDto = {
      name: 'Inter',
      fontFamily: 'Inter',
      provider: 'Google Fonts',
      category: 'sans-serif',
      weightMin: 400,
      weightMax: 700,
    } as any;

    typographiesServiceMock.create.mockResolvedValue({ id: 'typography-1' });

    await controller.create(request, 'project-1', dto);

    expect(typographiesServiceMock.create).toHaveBeenCalledWith(
      'project-1',
      dto,
      'user-1',
    );
  });

  it('should delegate listing requests with the authenticated user id', async () => {
    const request = { user: { id: 'user-1' } } as any;

    await controller.findAll(request, 'project-1');

    expect(typographiesServiceMock.findAllByProject).toHaveBeenCalledWith(
      'project-1',
      'user-1',
    );
  });

  it('should delegate update requests with the authenticated user id', async () => {
    const request = { user: { id: 'user-1' } } as any;
    const dto = {
      name: 'Inter Display',
      fontFamily: 'Inter Display',
      provider: 'Google Fonts',
    } as any;

    await controller.update(request, 'project-1', 'typography-1', dto);

    expect(typographiesServiceMock.update).toHaveBeenCalledWith(
      'project-1',
      'typography-1',
      dto,
      'user-1',
    );
  });

  it('should delegate remove requests with the authenticated user id', async () => {
    const request = { user: { id: 'user-1' } } as any;

    await controller.remove(request, 'project-1', 'typography-1');

    expect(typographiesServiceMock.remove).toHaveBeenCalledWith(
      'project-1',
      'typography-1',
      'user-1',
    );
  });
});
