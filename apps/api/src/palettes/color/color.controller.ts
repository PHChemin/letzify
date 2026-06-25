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
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ReorderColorsDto } from './dto/reorder-colors.dto';

@ApiTags('colors')
@ApiBearerAuth()
@Controller('palettes/:paletteId/colors')
@UseGuards(JwtAuthGuard)
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @ApiOperation({ summary: 'Lista as cores de uma paleta' })
  @ApiParam({ name: 'paletteId', description: 'UUID da paleta' })
  @ApiOkResponse({
    description: 'Lista de cores retornada com sucesso',
    isArray: true,
  })
  @Get()
  findAll(
    @Req() request: { user: { id: string } },
    @Param('paletteId', ParseIdPipe) paletteId: string,
  ) {
    return this.colorService.findAll(paletteId, request.user.id);
  }

  @ApiOperation({ summary: 'Adiciona uma nova cor a paleta' })
  @ApiParam({ name: 'paletteId', description: 'UUID da paleta' })
  @ApiBody({ type: CreateColorDto })
  @ApiCreatedResponse({ description: 'Cor criada com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Post()
  @HttpCode(201)
  create(
    @Req() request: { user: { id: string } },
    @Param('paletteId', ParseIdPipe) paletteId: string,
    @Body() dto: CreateColorDto,
  ) {
    return this.colorService.create(paletteId, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Reordena as cores da paleta' })
  @ApiParam({ name: 'paletteId', description: 'UUID da paleta' })
  @ApiBody({ type: ReorderColorsDto })
  @ApiOkResponse({ description: 'Ordem atualizada com sucesso' })
  @Patch('reorder')
  @HttpCode(200)
  reorder(
    @Req() request: { user: { id: string } },
    @Param('paletteId', ParseIdPipe) paletteId: string,
    @Body() dto: ReorderColorsDto,
  ) {
    return this.colorService.reorder(paletteId, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Atualiza uma cor da paleta' })
  @ApiParam({ name: 'colorId', description: 'UUID da cor' })
  @ApiBody({ type: UpdateColorDto })
  @ApiOkResponse({ description: 'Cor atualizada com sucesso' })
  @Patch(':colorId')
  @HttpCode(200)
  update(
    @Req() request: { user: { id: string } },
    @Param('paletteId', ParseIdPipe) paletteId: string,
    @Param('colorId', ParseIdPipe) colorId: string,
    @Body() dto: UpdateColorDto,
  ) {
    return this.colorService.update(paletteId, colorId, dto, request.user.id);
  }

  @ApiOperation({ summary: 'Remove uma cor da paleta' })
  @ApiParam({ name: 'colorId', description: 'UUID da cor' })
  @Delete(':colorId')
  @HttpCode(204)
  remove(
    @Req() request: { user: { id: string } },
    @Param('paletteId', ParseIdPipe) paletteId: string,
    @Param('colorId', ParseIdPipe) colorId: string,
  ) {
    return this.colorService.remove(paletteId, colorId, request.user.id);
  }
}
