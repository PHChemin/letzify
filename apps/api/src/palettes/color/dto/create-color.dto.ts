import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidationMessages } from '../../../common/utils/validation-messages';
import { OptionalStringTransform } from '../../../common/transforms/optional-string.transform';

export class CreateColorDto {
  @ApiProperty({ example: 'Primary Purple' })
  @IsString({ message: ValidationMessages.IsString('nome') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('nome') })
  @MinLength(1, { message: ValidationMessages.MinLength('nome', 1) })
  @MaxLength(100, { message: ValidationMessages.MaxLength('nome', 100) })
  name: string;

  @ApiProperty({ example: '#6B4773' })
  @IsString({ message: ValidationMessages.IsString('hexCode') })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: ValidationMessages.IsHexCode('hexCode'),
  })
  hexCode: string;

  @ApiPropertyOptional({ example: 'rgb(107,71,115)' })
  @OptionalStringTransform()
  @IsOptional()
  @IsString({ message: ValidationMessages.IsString('rgbValue') })
  @MaxLength(30, { message: ValidationMessages.MaxLength('rgbValue', 30) })
  rgbValue?: string;

  @ApiPropertyOptional({ example: 'cmyk(10,50,0,20)' })
  @OptionalStringTransform()
  @IsOptional()
  @IsString({ message: ValidationMessages.IsString('cmykValue') })
  @MaxLength(50, { message: ValidationMessages.MaxLength('cmykValue', 50) })
  cmykValue?: string;
}
