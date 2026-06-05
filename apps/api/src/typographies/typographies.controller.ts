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
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { CreateTypographyDto } from './dto/create-typography.dto';
import { TypographyResponseDto } from './dto/typography-response.dto';
import { UpdateTypographyDto } from './dto/update-typography.dto';
import { TypographiesService } from './typographies.service';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@ApiTags('typographies')
@ApiBearerAuth()
@Controller('projects/:projectId/typographies')
@UseGuards(JwtAuthGuard)
export class TypographiesController {
  constructor(private readonly typographiesService: TypographiesService) {}

  @ApiOperation({ summary: 'Cria uma tipografia vinculada a um projeto' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiBody({ type: CreateTypographyDto })
  @ApiCreatedResponse({
    description: 'Tipografia criada com sucesso',
    type: TypographyResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Projeto ou payload inválido' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Post()
  @HttpCode(201)
  create(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
    @Body() dto: CreateTypographyDto,
  ) {
    return this.typographiesService.create(projectId, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Lista tipografias de um projeto' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiOkResponse({
    description: 'Tipografias retornadas com sucesso',
    type: TypographyResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
  ) {
    return this.typographiesService.findAllByProject(
      projectId,
      request.user.id,
    );
  }

  @ApiOperation({ summary: 'Busca uma tipografia pelo identificador' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiParam({ name: 'id', description: 'UUID da tipografia' })
  @ApiOkResponse({
    description: 'Tipografia encontrada com sucesso',
    type: TypographyResponseDto,
  })
  @ApiBadRequestResponse({ description: 'ID ou projeto inválido' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.typographiesService.findOne(projectId, id, request.user.id);
  }

  @ApiOperation({ summary: 'Atualiza os dados de uma tipografia' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiParam({ name: 'id', description: 'UUID da tipografia' })
  @ApiBody({ type: UpdateTypographyDto })
  @ApiOkResponse({
    description: 'Tipografia atualizada com sucesso',
    type: TypographyResponseDto,
  })
  @ApiBadRequestResponse({ description: 'ID, projeto ou payload inválido' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Patch(':id')
  @HttpCode(200)
  update(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateTypographyDto,
  ) {
    return this.typographiesService.update(projectId, id, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Remove uma tipografia existente' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiParam({ name: 'id', description: 'UUID da tipografia' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiBadRequestResponse({ description: 'ID ou projeto inválido' })
  @Delete(':id')
  @HttpCode(204)
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('projectId', ParseIdPipe) projectId: string,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.typographiesService.remove(projectId, id, request.user.id);
  }
}
