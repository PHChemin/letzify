import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectAlreadyExistsException } from './exceptions/project-already-exists.exception';

describe('ProjectsService', () => {
  let service: ProjectsService;
  const prismaServiceMock = {
    brandProject: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a project using the authenticated owner id', async () => {
    prismaServiceMock.brandProject.findUnique.mockResolvedValue(null);
    prismaServiceMock.brandProject.create.mockResolvedValue({
      id: 'project-1',
    });

    const result = await service.create(
      {
        name: 'Brandbook 2026',
        description: 'Projeto de identidade visual da campanha 2026',
        status: 'ALIGNMENT' as any,
      },
      'owner-1',
    );

    expect(prismaServiceMock.brandProject.findUnique).toHaveBeenCalledWith({
      where: { slug: 'brandbook-2026' },
    });
    expect(prismaServiceMock.brandProject.create).toHaveBeenCalledWith({
      data: {
        name: 'Brandbook 2026',
        slug: 'brandbook-2026',
        description: 'Projeto de identidade visual da campanha 2026',
        status: 'ALIGNMENT',
        ownerId: 'owner-1',
      },
    });
    expect(result).toEqual({ id: 'project-1' });
  });

  it('should throw when a project with the same slug already exists', async () => {
    prismaServiceMock.brandProject.findUnique.mockResolvedValue({
      id: 'project-1',
    });

    await expect(
      service.create(
        {
          name: 'Brandbook 2026',
          description: 'Projeto de identidade visual da campanha 2026',
          status: 'ALIGNMENT' as any,
        },
        'owner-1',
      ),
    ).rejects.toBeInstanceOf(ProjectAlreadyExistsException);
  });
});
