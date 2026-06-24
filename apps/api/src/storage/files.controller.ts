import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { StorageService } from './storage.service';

type AuthenticatedRequest = Request & {
  user: { id: string };
};

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Faz download de um asset visual armazenado' })
  @ApiParam({ name: 'fileKey', description: 'Chave relativa do arquivo' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Get(':projectId/:fileName')
  async download(
    @Req() request: AuthenticatedRequest,
    @Param('projectId') projectId: string,
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const fileKey = `${projectId}/${fileName}`;

    const asset = await this.prisma.visualAsset.findFirst({
      where: {
        fileKey,
        project: { ownerId: request.user.id },
      },
    });

    if (!asset) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    response.setHeader(
      'Content-Type',
      asset.mimeType ?? 'application/octet-stream',
    );
    response.setHeader(
      'Content-Disposition',
      `inline; filename="${asset.name}"`,
    );

    return this.storageService.streamFile(fileKey, response);
  }
}
