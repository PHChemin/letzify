import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTypographyDto } from './dto/create-typography.dto';
import { UpdateTypographyDto } from './dto/update-typography.dto';

@Injectable()
export class TypographiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, dto: CreateTypographyDto, ownerId: string) {
    await this.findOwnedProject(projectId, ownerId);

    return this.prisma.typography.create({
      data: {
        projectId,
        name: dto.name,
        fontFamily: dto.fontFamily,
        provider: dto.provider,
        category: dto.category ?? null,
        weightMin: dto.weightMin ?? null,
        weightMax: dto.weightMax ?? null,
      },
    });
  }

  async findAllByProject(projectId: string, ownerId: string) {
    await this.findOwnedProject(projectId, ownerId);

    return this.prisma.typography.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(projectId: string, id: string, ownerId: string) {
    const typography = await this.prisma.typography.findFirst({
      where: {
        id,
        projectId,
        project: { is: { ownerId } },
      },
    });

    if (!typography) {
      throw new NotFoundException('Tipografia não encontrada');
    }

    return typography;
  }

  async update(
    projectId: string,
    id: string,
    data: UpdateTypographyDto,
    ownerId: string,
  ) {
    await this.findOne(projectId, id, ownerId);

    const updateData: Prisma.TypographyUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.fontFamily !== undefined) {
      updateData.fontFamily = data.fontFamily;
    }

    if (data.provider !== undefined) {
      updateData.provider = data.provider;
    }

    if (data.category !== undefined) {
      updateData.category = data.category;
    }

    if (data.weightMin !== undefined) {
      updateData.weightMin = data.weightMin;
    }

    if (data.weightMax !== undefined) {
      updateData.weightMax = data.weightMax;
    }

    return this.prisma.typography.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(projectId: string, id: string, ownerId: string) {
    await this.findOne(projectId, id, ownerId);

    await this.prisma.typography.delete({
      where: { id },
    });
  }

  private async findOwnedProject(projectId: string, ownerId: string) {
    const project = await this.prisma.brandProject.findFirst({
      where: { id: projectId, ownerId },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return project;
  }
}
