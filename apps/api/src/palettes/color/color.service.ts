import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ReorderColorsDto } from './dto/reorder-colors.dto';

@Injectable()
export class ColorService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paletteId: string, ownerId: string) {
    await this.findOwnedPalette(paletteId, ownerId);

    return this.prisma.paletteColor.findMany({
      where: { paletteId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(paletteId: string, dto: CreateColorDto, ownerId: string) {
    await this.findOwnedPalette(paletteId, ownerId);

    const duplicateHex = await this.prisma.paletteColor.findFirst({
      where: { paletteId, hexCode: dto.hexCode },
    });
    if (duplicateHex)
      throw new BadRequestException(
        'Já existe uma cor com esse hexadecimal nesta paleta.',
      );

    const existingColors = await this.prisma.paletteColor.findMany({
      where: { paletteId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, sortOrder: true },
    });

    const nextSortOrder =
      existingColors.length > 0
        ? existingColors[existingColors.length - 1].sortOrder + 1
        : 1;

    return this.prisma.paletteColor.create({
      data: {
        paletteId,
        name: dto.name,
        hexCode: dto.hexCode,
        rgbValue: dto.rgbValue || null,
        cmykValue: dto.cmykValue || null,
        sortOrder: nextSortOrder,
      },
    });
  }

  async update(
    paletteId: string,
    colorId: string,
    dto: UpdateColorDto,
    ownerId: string,
  ) {
    await this.findOwnedPalette(paletteId, ownerId);
    const color = await this.findOwnedColor(paletteId, colorId);

    return this.prisma.paletteColor.update({
      where: { id: color.id },
      data: {
        name: dto.name ?? undefined,
        hexCode: dto.hexCode ?? undefined,
        rgbValue: dto.rgbValue ?? undefined,
        cmykValue: dto.cmykValue ?? undefined,
      },
    });
  }

  async remove(paletteId: string, colorId: string, ownerId: string) {
    await this.findOwnedPalette(paletteId, ownerId);
    await this.findOwnedColor(paletteId, colorId);
    await this.prisma.paletteColor.delete({ where: { id: colorId } });
  }

  async reorder(paletteId: string, dto: ReorderColorsDto, ownerId: string) {
    await this.findOwnedPalette(paletteId, ownerId);

    const currentColors = await this.prisma.paletteColor.findMany({
      where: { paletteId },
      select: { id: true, sortOrder: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (currentColors.length !== dto.colorIds.length)
      throw new BadRequestException(
        'A lista de cores deve conter exatamente as cores da paleta.',
      );

    const currentIds = currentColors.map((color) => color.id).sort();
    const nextIds = [...dto.colorIds].sort();
    if (currentIds.join(',') !== nextIds.join(','))
      throw new BadRequestException(
        'A lista de cores deve conter exatamente as cores da paleta.',
      );

    return this.prisma.$transaction(
      dto.colorIds.map((colorId, index) =>
        this.prisma.paletteColor.update({
          where: { id: colorId },
          data: { sortOrder: index + 1 },
        }),
      ),
    );
  }

  private async findOwnedPalette(paletteId: string, ownerId: string) {
    const palette = await this.prisma.colorPalette.findFirst({
      where: { id: paletteId, project: { is: { ownerId } } },
    });
    if (!palette) throw new NotFoundException('Paleta não encontrada');
    return palette;
  }

  private async findOwnedColor(paletteId: string, colorId: string) {
    const color = await this.prisma.paletteColor.findFirst({
      where: { id: colorId, paletteId },
    });
    if (!color) throw new NotFoundException('Cor não encontrada');
    return color;
  }
}
