import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { AssetsService } from './assets.service';
import { AssetResponseDto } from './dto/asset-response.dto';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { UploadAssetDto } from './dto/upload-asset.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@ApiTags('assets')
@ApiBearerAuth()
@Controller('projects/:projectId/assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @ApiOperation({ summary: 'Faz upload de um asset visual para o projeto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        assetType: { type: 'string' },
      },
      required: ['file', 'name', 'assetType'],
    },
  })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiCreatedResponse({
    description: 'Asset visual enviado com sucesso',
    type: AssetResponseDto,
  })
  @Post('upload')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  upload(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadAssetDto,
  ) {
    return this.assetsService.createFromUpload(
      projectId,
      file,
      dto.name,
      dto.assetType,
      request.user.id,
    );
  }

  @ApiOperation({ summary: 'Cria um asset visual vinculado a um projeto' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiBody({ type: CreateAssetDto })
  @ApiCreatedResponse({
    description: 'Asset visual criado com sucesso',
    type: AssetResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Projeto ou payload inválido' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Post()
  @HttpCode(201)
  create(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
    @Body() dto: CreateAssetDto,
  ) {
    return this.assetsService.create(projectId, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Lista assets visuais de um projeto' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiOkResponse({
    description: 'Assets visuais retornados com sucesso',
    type: AssetResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
  ) {
    return this.assetsService.findAllByProject(projectId, request.user.id);
  }

  @ApiOperation({ summary: 'Busca um asset visual pelo identificador' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiParam({ name: 'id', description: 'UUID do asset visual' })
  @ApiOkResponse({
    description: 'Asset visual encontrado com sucesso',
    type: AssetResponseDto,
  })
  @ApiBadRequestResponse({ description: 'ID ou projeto inválido' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.assetsService.findOne(projectId, id, request.user.id);
  }

  @ApiOperation({ summary: 'Atualiza os dados de um asset visual' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiParam({ name: 'id', description: 'UUID do asset visual' })
  @ApiBody({ type: UpdateAssetDto })
  @ApiOkResponse({
    description: 'Asset visual atualizado com sucesso',
    type: AssetResponseDto,
  })
  @ApiBadRequestResponse({ description: 'ID, projeto ou payload inválido' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Patch(':id')
  @HttpCode(200)
  update(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAssetDto,
  ) {
    return this.assetsService.update(projectId, id, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Remove um asset visual existente' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiParam({ name: 'id', description: 'UUID do asset visual' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiBadRequestResponse({ description: 'ID ou projeto inválido' })
  @Delete(':id')
  @HttpCode(204)
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.assetsService.remove(projectId, id, request.user.id);
  }
}
