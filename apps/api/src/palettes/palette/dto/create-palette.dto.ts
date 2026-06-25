import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidationMessages } from '../../../common/utils/validation-messages';
import { OptionalStringTransform } from '../../../common/transforms/optional-string.transform';

export class CreatePaletteDto {
  @ApiProperty({ example: 'Paleta Principal' })
  @IsString({ message: ValidationMessages.IsString('nome') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('nome') })
  @MinLength(3, { message: ValidationMessages.MinLength('nome', 3) })
  @MaxLength(100, { message: ValidationMessages.MaxLength('nome', 100) })
  name: string;

  @ApiPropertyOptional({ example: 'Paleta principal do projeto' })
  @OptionalStringTransform()
  @IsOptional()
  @IsString({ message: ValidationMessages.IsString('descrição') })
  @MaxLength(500, { message: ValidationMessages.MaxLength('descrição', 500) })
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean({ message: ValidationMessages.IsBoolean('isPrimary') })
  isPrimary?: boolean = false;
}
