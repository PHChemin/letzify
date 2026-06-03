import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @ApiOperation({ summary: 'Acessa a área restrita de administração' })
  @ApiOkResponse({
    description: 'Mensagem de boas-vindas ao administrador',
    schema: {
      example: { message: 'Bem Vindo, Admin!' },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Usuário sem role ADMIN' })
  @Get()
  @Roles('ADMIN')
  getAdmin() {
    return { message: 'Bem Vindo, Admin!' };
  }
}
