import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ValidationMessages } from '../../common/utils/validation-messages';

export class LoginDto {
  @ApiProperty({ example: 'designer@letzify.com' })
  @IsEmail({}, { message: ValidationMessages.IsEmail('email') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('email') })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString({ message: ValidationMessages.IsString('senha') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('senha') })
  @MinLength(6, { message: ValidationMessages.MinLength('senha', 6) })
  password: string;
}
