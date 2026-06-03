import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  const projectsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: projectsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should pass the authenticated user id to the service when creating a project', async () => {
    const request = { user: { id: 'user-1', roles: ['USER'] } } as any;
    const dto: CreateProjectDto = {
      name: 'Brandbook 2026',
      description: 'Projeto de identidade visual da campanha 2026',
      status: 'ALIGNMENT' as any,
    };

    projectsServiceMock.create.mockResolvedValue({ id: 'project-1' });

    await controller.create(request, dto);

    expect(projectsServiceMock.create).toHaveBeenCalledWith(dto, 'user-1');
  });
});
