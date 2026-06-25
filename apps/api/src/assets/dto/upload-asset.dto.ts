import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ValidationMessages } from '../../common/utils/validation-messages';

export class UploadAssetDto {
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
}
