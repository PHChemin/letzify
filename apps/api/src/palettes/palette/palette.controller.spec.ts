import { Test, TestingModule } from '@nestjs/testing';
import { PaletteController } from './palette.controller';
import { PaletteService } from './palette.service';
import { CreatePaletteDto } from './dto/create-palette.dto';

describe('PaletteController', () => {
  let controller: PaletteController;
  const paletteServiceMock = {
    create: jest.fn(),
    findAllByProject: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaletteController],
      providers: [{ provide: PaletteService, useValue: paletteServiceMock }],
    }).compile();

    controller = module.get<PaletteController>(PaletteController);
    jest.clearAllMocks();
  });

  it('should pass authenticated user id to service when creating a palette', async () => {
    const request = { user: { id: 'user-1' } } as any;
    const dto: CreatePaletteDto = {
      name: 'Main',
      description: 'desc',
      isPrimary: false,
    } as any;
    paletteServiceMock.create.mockResolvedValue({ id: 'palette-1' });

    await controller.create(request, 'project-1', dto);

    expect(paletteServiceMock.create).toHaveBeenCalledWith(
      'project-1',
      dto,
      'user-1',
    );
  });
});
