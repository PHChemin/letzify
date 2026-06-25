import { PartialType } from '@nestjs/swagger';
import { CreateTypographyDto } from './create-typography.dto';

export class UpdateTypographyDto extends PartialType(CreateTypographyDto) {}
