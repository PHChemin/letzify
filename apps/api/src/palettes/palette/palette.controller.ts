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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PaletteService } from './palette.service';
import { CreatePaletteDto } from './dto/create-palette.dto';
import { UpdatePaletteDto } from './dto/update-palette.dto';

@ApiTags('palettes')
@ApiBearerAuth()
@Controller('projects/:projectId/palettes')
@UseGuards(JwtAuthGuard)
export class PaletteController {
  constructor(private readonly paletteService: PaletteService) {}

  @ApiOperation({ summary: 'Cria paleta vinculada a um projeto' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiBody({ type: CreatePaletteDto })
  @ApiCreatedResponse({ description: 'Paleta criada com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Post()
  @HttpCode(201)
  create(
    @Req() request: { user: { id: string } },
    @Param('projectId', ParseIdPipe) projectId: string,
    @Body() dto: CreatePaletteDto,
  ) {
    return this.paletteService.create(projectId, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Lista paletas de um projeto' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiOkResponse({
    description: 'Paletas retornadas com sucesso',
    isArray: true,
  })
  @Get()
  findAll(
    @Req() request: { user: { id: string } },
    @Param('projectId', ParseIdPipe) projectId: string,
  ) {
    return this.paletteService.findAllByProject(projectId, request.user.id);
  }

  @ApiOperation({ summary: 'Busca uma paleta pelo identificador' })
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiParam({ name: 'id', description: 'UUID da paleta' })
  @ApiOkResponse({ description: 'Paleta encontrada com sucesso' })
  @Get(':id')
  findOne(
    @Req() request: { user: { id: string } },
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.paletteService.findOne(id, request.user.id);
  }

  @ApiOperation({ summary: 'Atualiza dados de uma paleta' })
  @ApiParam({ name: 'id', description: 'UUID da paleta' })
  @ApiBody({ type: UpdatePaletteDto })
  @ApiOkResponse({ description: 'Paleta atualizada com sucesso' })
  @Patch(':id')
  @HttpCode(200)
  update(
    @Req() request: { user: { id: string } },
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdatePaletteDto,
  ) {
    return this.paletteService.update(id, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Remove uma paleta existente' })
  @ApiParam({ name: 'id', description: 'UUID da paleta' })
  @Delete(':id')
  @HttpCode(204)
  remove(
    @Req() request: { user: { id: string } },
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.paletteService.remove(id, request.user.id);
  }
}
