import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { ProjectAlreadyExistsException } from './exceptions/project-already-exists.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto, ownerId: string) {
    const slug = this.generateSlug(dto.name);
    const slugExists = await this.prisma.brandProject.findUnique({
      where: { slug },
    });
    if (slugExists) {
      throw new ProjectAlreadyExistsException(dto.name);
    }

    return this.prisma.brandProject.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description || null,
        status: dto.status || 'ALIGNMENT',
        ownerId,
      },
    });
  }

  async findAll(query: QueryFilterDto, ownerId: string) {
    const limit = 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const where: Prisma.BrandProjectWhereInput = {
      ownerId,
    };
    if (query.filter) {
      where.OR = [
        { name: { contains: query.filter, mode: 'insensitive' } },
        { description: { contains: query.filter, mode: 'insensitive' } },
      ];
    }

    return this.prisma.brandProject.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, ownerId: string) {
    const project = await this.prisma.brandProject.findFirst({
      where: { id, ownerId },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');
    return project;
  }

  async update(id: string, data: Partial<CreateProjectDto>, ownerId: string) {
    const project = await this.findOne(id, ownerId);

    const updateData: Prisma.BrandProjectUpdateInput = {
      description: data.description,
      status: data.status,
    };

    if (data.name) {
      const slug = this.generateSlug(data.name);
      const slugExists = await this.prisma.brandProject.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });
      if (slugExists) {
        throw new ProjectAlreadyExistsException(data.name);
      }
      updateData.name = data.name;
      updateData.slug = slug;
    }

    return this.prisma.brandProject.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, ownerId: string) {
    await this.findOne(id, ownerId);
    await this.prisma.brandProject.delete({
      where: { id },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
