import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ValidationMessages } from '../../common/utils/validation-messages';

export class QueryFilterDto {
  @ApiPropertyOptional({ example: 'campanha' })
  @IsOptional()
  @IsString({ message: ValidationMessages.IsString('filtro') })
  @Transform(({ value }: { value: string }) => value?.trim())
  filter?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.IsInt('page') })
  @Min(1, { message: ValidationMessages.Min('page', 1) })
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ValidationMessages.IsInt('limit') })
  @Min(1, { message: ValidationMessages.Min('limit', 1) })
  @Max(50, { message: ValidationMessages.Max('limit', 50) })
  limit?: number = 10;
}
