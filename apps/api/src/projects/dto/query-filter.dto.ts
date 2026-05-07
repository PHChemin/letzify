import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidationMessages } from '../../common/utils/validation-messages';

export class QueryFilterDto {
    @IsOptional()
    @IsString({ message: ValidationMessages.IsString('filtro') })
    @Transform(({ value }: { value: string }) => value?.trim())
    filter?: string;

    @IsOptional()
    @Transform(({ value }: { value: string }) => parseInt(value, 10))
    page?: number;
}