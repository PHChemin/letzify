import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';
import { ValidationMessages } from '../../common/utils/validation-messages';
import { OptionalStringTransform } from '../../common/transforms/optional-string.transform';

export class CreateProjectDto {
  @ApiProperty({ example: 'Brandbook 2026' })
  @IsString({ message: ValidationMessages.IsString('nome') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('nome') })
  @MinLength(3, { message: ValidationMessages.MinLength('nome', 3) })
  @MaxLength(100, { message: ValidationMessages.MaxLength('nome', 100) })
  name: string;

  @ApiPropertyOptional({
    example: 'Projeto de identidade visual da campanha 2026',
  })
  @OptionalStringTransform()
  @IsOptional()
  @IsString({ message: ValidationMessages.IsString('descrição') })
  @MaxLength(1000, { message: ValidationMessages.MaxLength('descrição', 1000) })
  description?: string;

  @ApiPropertyOptional({
    enum: ProjectStatus,
    example: ProjectStatus.ALIGNMENT,
  })
  @IsEnum(ProjectStatus, { message: ValidationMessages.IsEnum('status') })
  @IsOptional()
  status: ProjectStatus = ProjectStatus.ALIGNMENT;
}
