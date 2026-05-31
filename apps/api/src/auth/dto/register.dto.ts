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
  @IsEmail({}, { message: ValidationMessages.IsEmail('email') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('email') })
  email: string;

  @IsString({ message: ValidationMessages.IsString('senha') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('senha') })
  @MinLength(6, { message: ValidationMessages.MinLength('senha', 6) })
  @MaxLength(128, { message: ValidationMessages.MaxLength('senha', 128) })
  password: string;

  @IsString({ message: ValidationMessages.IsString('nome') })
  @IsOptional()
  @MinLength(2, { message: ValidationMessages.MinLength('nome', 2) })
  @MaxLength(100, { message: ValidationMessages.MaxLength('nome', 100) })
  name?: string;
}
