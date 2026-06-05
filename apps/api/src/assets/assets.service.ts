import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, dto: CreateAssetDto, ownerId: string) {
    await this.findOwnedProject(projectId, ownerId);

    return this.prisma.visualAsset.create({
      data: {
        projectId,
        uploadedById: ownerId,
        name: dto.name,
        assetType: dto.assetType,
        fileUrl: dto.fileUrl,
        fileKey: dto.fileKey,
        mimeType: dto.mimeType ?? null,
        fileSizeBytes: dto.fileSizeBytes ?? null,
        checksumSha256: dto.checksumSha256 ?? null,
      },
    });
  }

  async findAllByProject(projectId: string, ownerId: string) {
    await this.findOwnedProject(projectId, ownerId);

    return this.prisma.visualAsset.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(projectId: string, id: string, ownerId: string) {
    const asset = await this.prisma.visualAsset.findFirst({
      where: {
        id,
        projectId,
        project: { is: { ownerId } },
      },
    });

    if (!asset) {
      throw new NotFoundException('Asset visual não encontrado');
    }

    return asset;
  }

  async update(
    projectId: string,
    id: string,
    data: UpdateAssetDto,
    ownerId: string,
  ) {
    await this.findOne(projectId, id, ownerId);

    const updateData: Prisma.VisualAssetUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.assetType !== undefined) {
      updateData.assetType = data.assetType;
    }

    if (data.fileUrl !== undefined) {
      updateData.fileUrl = data.fileUrl;
    }

    if (data.fileKey !== undefined) {
      updateData.fileKey = data.fileKey;
    }

    if (data.mimeType !== undefined) {
      updateData.mimeType = data.mimeType;
    }

    if (data.fileSizeBytes !== undefined) {
      updateData.fileSizeBytes = data.fileSizeBytes;
    }

    if (data.checksumSha256 !== undefined) {
      updateData.checksumSha256 = data.checksumSha256;
    }

    return this.prisma.visualAsset.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(projectId: string, id: string, ownerId: string) {
    await this.findOne(projectId, id, ownerId);

    await this.prisma.visualAsset.delete({
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
