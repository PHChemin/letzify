import { Test, TestingModule } from '@nestjs/testing';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';

describe('ColorController', () => {
  let controller: ColorController;
  const colorServiceMock = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    reorder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorController],
      providers: [{ provide: ColorService, useValue: colorServiceMock }],
    }).compile();
    controller = module.get<ColorController>(ColorController);
    jest.clearAllMocks();
  });

  it('should forward palette id and user id when listing colors', async () => {
    const request = { user: { id: 'user-1' } } as any;
    await controller.findAll(request, 'palette-1');
    expect(colorServiceMock.findAll).toHaveBeenCalledWith(
      'palette-1',
      'user-1',
    );
  });
});
