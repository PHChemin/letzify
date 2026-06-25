import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from '../auth/dto/user.dto';
import { UsersService } from './users.service';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Retorna o perfil do usuário autenticado' })
  @ApiOkResponse({
    description: 'Perfil do usuário autenticado',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @Get('me')
  me(@Req() request: AuthenticatedRequest): Promise<UserDto> {
    return this.usersService.getMe(request.user.id);
  }
}
