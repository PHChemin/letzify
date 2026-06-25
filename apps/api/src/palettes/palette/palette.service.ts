import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaletteDto } from './dto/create-palette.dto';
import { UpdatePaletteDto } from './dto/update-palette.dto';

@Injectable()
export class PaletteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, dto: CreatePaletteDto, ownerId: string) {
    await this.findOwnedProject(projectId, ownerId);

    if (dto.isPrimary) {
      await this.prisma.colorPalette.updateMany({
        where: { projectId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.colorPalette.create({
      data: {
        projectId,
        name: dto.name,
        description: dto.description || null,
        isPrimary: dto.isPrimary || false,
      },
    });
  }

  async findAllByProject(projectId: string, ownerId: string) {
    await this.findOwnedProject(projectId, ownerId);

    return this.prisma.colorPalette.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(paletteId: string, ownerId: string) {
    const palette = await this.prisma.colorPalette.findFirst({
      where: { id: paletteId, project: { is: { ownerId } } },
    });

    if (!palette) {
      throw new NotFoundException('Paleta não encontrada');
    }

    return palette;
  }

  async update(id: string, data: UpdatePaletteDto, ownerId: string) {
    const palette = await this.findOne(id, ownerId);

    if (data.isPrimary) {
      await this.prisma.colorPalette.updateMany({
        where: { projectId: palette.projectId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.colorPalette.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        isPrimary: data.isPrimary ?? undefined,
      },
    });
  }

  async remove(id: string, ownerId: string) {
    await this.findOne(id, ownerId);

    await this.prisma.colorPalette.delete({ where: { id } });
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
