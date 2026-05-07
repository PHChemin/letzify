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

export class CreateProjectDto {
    @IsString({ message: ValidationMessages.IsString('nome') })
    @IsNotEmpty({ message: ValidationMessages.IsNotEmpty('nome') })
    @MinLength(3, { message: ValidationMessages.MinLength('nome', 3) })
    @MaxLength(100, { message: ValidationMessages.MaxLength('nome', 100) })
    name: string;

    @IsString({ message: ValidationMessages.IsString('descrição') })
    @IsOptional()
    @MinLength(10, { message: ValidationMessages.MinLength('descrição', 10) })
    @MaxLength(1000, { message: ValidationMessages.MaxLength('descrição', 1000) })
    description?: string;

    @IsEnum(ProjectStatus, { message: ValidationMessages.IsEnum('status') })
    @IsOptional()
    status: ProjectStatus = ProjectStatus.ALIGNMENT;
}