import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidationMessages } from '../../common/utils/validation-messages';

export class RegisterDto {
  @ApiProperty({ example: 'designer@letzify.com' })
  @IsEmail({}, { message: ValidationMessages.IsEmail('email') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('email') })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString({ message: ValidationMessages.IsString('senha') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('senha') })
  @MinLength(6, { message: ValidationMessages.MinLength('senha', 6) })
  @MaxLength(128, { message: ValidationMessages.MaxLength('senha', 128) })
  password: string;

  @ApiPropertyOptional({ example: 'Designer Letzify' })
  @IsString({ message: ValidationMessages.IsString('nome') })
  @IsOptional()
  @MinLength(2, { message: ValidationMessages.MinLength('nome', 2) })
  @MaxLength(100, { message: ValidationMessages.MaxLength('nome', 100) })
  name?: string;
}
