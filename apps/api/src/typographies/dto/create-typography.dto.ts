import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ValidationMessages } from '../../common/utils/validation-messages';
import { OptionalStringTransform } from '../../common/transforms/optional-string.transform';

export class CreateTypographyDto {
  @ApiProperty({ example: 'Inter' })
  @IsString({ message: ValidationMessages.IsString('nome') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('nome') })
  @MinLength(2, { message: ValidationMessages.MinLength('nome', 2) })
  @MaxLength(100, { message: ValidationMessages.MaxLength('nome', 100) })
  name: string;

  @ApiProperty({ example: 'Inter' })
  @IsString({ message: ValidationMessages.IsString('fontFamily') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('fontFamily') })
  @MinLength(2, { message: ValidationMessages.MinLength('fontFamily', 2) })
  @MaxLength(120, { message: ValidationMessages.MaxLength('fontFamily', 120) })
  fontFamily: string;

  @ApiProperty({ example: 'Google Fonts' })
  @IsString({ message: ValidationMessages.IsString('provider') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('provider') })
  @MinLength(2, { message: ValidationMessages.MinLength('provider', 2) })
  @MaxLength(80, { message: ValidationMessages.MaxLength('provider', 80) })
  provider: string;

  @ApiPropertyOptional({ example: 'sans-serif' })
  @OptionalStringTransform()
  @IsOptional()
  @IsString({ message: ValidationMessages.IsString('category') })
  @MaxLength(50, { message: ValidationMessages.MaxLength('category', 50) })
  category?: string;

  @ApiPropertyOptional({ example: 400, minimum: 1, maximum: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.IsInt('weightMin') })
  @Min(1, { message: ValidationMessages.Min('weightMin', 1) })
  weightMin?: number;

  @ApiPropertyOptional({ example: 700, minimum: 1, maximum: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.IsInt('weightMax') })
  @Min(1, { message: ValidationMessages.Min('weightMax', 1) })
  weightMax?: number;
}
