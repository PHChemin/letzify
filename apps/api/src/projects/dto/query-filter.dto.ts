import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidationMessages } from '../../common/utils/validation-messages';

export class QueryFilterDto {
  @ApiPropertyOptional({ example: 'campanha' })
  @IsOptional()
  @IsString({ message: ValidationMessages.IsString('filtro') })
  @Transform(({ value }: { value: string }) => value?.trim())
  filter?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  page?: number;
}
