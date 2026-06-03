import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  Query,
  UseFilters,
  UseGuards,
  Req,
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { ProjectAlreadyExistsFilter } from './filters/project-already-exists.filter';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { ProjectResponseDto } from './dto/project-response.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    roles: Role[];
  };
};

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
@UseFilters(ProjectAlreadyExistsFilter)
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Cria um novo projeto de identidade visual' })
  @ApiBody({ type: CreateProjectDto })
  @ApiCreatedResponse({
    description: 'Projeto criado com sucesso',
    type: ProjectResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos no payload' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Post()
  @HttpCode(201)
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto, request.user.id);
  }

  @ApiOperation({ summary: 'Lista os projetos do usuário autenticado' })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Texto para filtrar projetos por nome ou descrição',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Lista de projetos retornada com sucesso',
    type: ProjectResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
    @Query() query: QueryFilterDto,
  ) {
    return this.projectsService.findAll(query, request.user.id);
  }

  @ApiOperation({ summary: 'Busca um projeto pelo identificador' })
  @ApiParam({ name: 'id', description: 'UUID do projeto' })
  @ApiOkResponse({
    description: 'Projeto encontrado com sucesso',
    type: ProjectResponseDto,
  })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.projectsService.findOne(id, request.user.id);
  }

  @ApiOperation({ summary: 'Atualiza os dados de um projeto' })
  @ApiParam({ name: 'id', description: 'UUID do projeto' })
  @ApiBody({ type: CreateProjectDto })
  @ApiOkResponse({
    description: 'Projeto atualizado com sucesso',
    type: ProjectResponseDto,
  })
  @ApiBadRequestResponse({ description: 'ID ou payload inválido' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Patch(':id')
  @HttpCode(200)
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: Partial<CreateProjectDto>,
  ) {
    return this.projectsService.update(id, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Remove um projeto existente' })
  @ApiParam({ name: 'id', description: 'UUID do projeto' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @Delete(':id')
  @HttpCode(204)
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIdPipe) id: string,
  ) {
    this.projectsService.remove(id, request.user.id);
  }
}
