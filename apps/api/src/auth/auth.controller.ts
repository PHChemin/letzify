import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Realiza o registro do usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'Usuário registrado com sucesso',
    type: UserDto,
  })
  @ApiConflictResponse({ description: 'Email já está em uso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos no payload' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    const newUser = await this.authService.register(dto);
    return newUser;
  }

  @ApiOperation({ summary: 'Realiza login com email e senha' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login com sucesso',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @ApiBadRequestResponse({ description: 'Dados inválidos no payload' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    const jwt = await this.authService.login(dto);
    return jwt;
  }
}
