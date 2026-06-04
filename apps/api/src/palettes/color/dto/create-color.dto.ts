import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ValidationMessages } from '../../../common/utils/validation-messages';

export class CreateColorDto {
  @ApiProperty({ example: 'Primary Purple' })
  @IsString({ message: ValidationMessages.IsString('nome') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('nome') })
  @MinLength(1, { message: ValidationMessages.MinLength('nome', 1) })
  @MaxLength(100, { message: ValidationMessages.MaxLength('nome', 100) })
  name: string;

  @ApiProperty({ example: '#6B4773' })
  @IsString({ message: ValidationMessages.IsString('hexCode') })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: ValidationMessages.IsHexCode('hexCode') })
  hexCode: string;

  @ApiProperty({ example: 'rgb(107,71,115)' })
  @IsString({ message: ValidationMessages.IsString('rgbValue') })
  @MinLength(7, { message: ValidationMessages.MinLength('rgbValue', 7) })
  @MaxLength(30, { message: ValidationMessages.MaxLength('rgbValue', 30) })
  rgbValue?: string;

  @ApiProperty({ example: 'cmyk(10,50,0,20)' })
  @IsString({ message: ValidationMessages.IsString('cmykValue') })
  @MinLength(3, { message: ValidationMessages.MinLength('cmykValue', 3) })
  @MaxLength(50, { message: ValidationMessages.MaxLength('cmykValue', 50) })
  cmykValue?: string;
}
