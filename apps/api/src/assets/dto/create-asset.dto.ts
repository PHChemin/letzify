import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ValidationMessages } from '../../common/utils/validation-messages';

export class CreateAssetDto {
  @ApiProperty({ example: 'Logo Principal' })
  @IsString({ message: ValidationMessages.IsString('nome') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('nome') })
  @MinLength(2, { message: ValidationMessages.MinLength('nome', 2) })
  @MaxLength(120, { message: ValidationMessages.MaxLength('nome', 120) })
  name: string;

  @ApiProperty({ example: 'LOGO' })
  @IsString({ message: ValidationMessages.IsString('assetType') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('assetType') })
  @MinLength(2, { message: ValidationMessages.MinLength('assetType', 2) })
  @MaxLength(50, { message: ValidationMessages.MaxLength('assetType', 50) })
  assetType: string;

  @ApiProperty({ example: 'https://cdn.letzify.dev/assets/logo.svg' })
  @IsString({ message: ValidationMessages.IsString('fileUrl') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('fileUrl') })
  @IsUrl({}, { message: 'O campo fileUrl deve ser uma URL válida.' })
  @MaxLength(500, { message: ValidationMessages.MaxLength('fileUrl', 500) })
  fileUrl: string;

  @ApiProperty({ example: 'projects/project-1/logo.svg' })
  @IsString({ message: ValidationMessages.IsString('fileKey') })
  @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('fileKey') })
  @MinLength(3, { message: ValidationMessages.MinLength('fileKey', 3) })
  @MaxLength(255, { message: ValidationMessages.MaxLength('fileKey', 255) })
  fileKey: string;

  @ApiPropertyOptional({ example: 'image/svg+xml' })
  @IsOptional()
  @IsString({ message: ValidationMessages.IsString('mimeType') })
  @MaxLength(100, { message: ValidationMessages.MaxLength('mimeType', 100) })
  mimeType?: string;

  @ApiPropertyOptional({ example: 2048, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.IsInt('fileSizeBytes') })
  @Min(1, { message: ValidationMessages.Min('fileSizeBytes', 1) })
  fileSizeBytes?: number;

  @ApiPropertyOptional({
    example: '3f786850e387550fdab836ed7e6dc881de23001b86c8e6f89b9f8f0f2c8f4f12',
  })
  @IsOptional()
  @IsString({ message: ValidationMessages.IsString('checksumSha256') })
  @Length(64, 64, {
    message: 'O campo checksumSha256 deve ter exatamente 64 caracteres.',
  })
  checksumSha256?: string;
}
