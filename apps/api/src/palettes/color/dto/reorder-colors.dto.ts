import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class ReorderColorsDto {
  @ApiProperty({
    example: ['color-id-1', 'color-id-2', 'color-id-3'],
    type: [String],
  })
  @IsArray({ message: 'O campo colorIds deve ser um array.' })
  @ArrayNotEmpty({ message: 'O campo colorIds não pode estar vazio.' })
  @ArrayUnique({
    message: 'O campo colorIds não pode conter valores duplicados.',
  })
  @IsUUID('4', {
    each: true,
    message: 'O campo colorIds deve conter UUIDs válidos.',
  })
  colorIds: string[];
}
