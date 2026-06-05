import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TypographyResponseDto {
  @ApiProperty({ example: '3f3a2c0f-92cc-4a49-a8c5-8e3de7f4f2c1' })
  id: string;

  @ApiProperty({ example: '3f3a2c0f-92cc-4a49-a8c5-8e3de7f4f2c1' })
  projectId: string;

  @ApiProperty({ example: 'Inter' })
  name: string;

  @ApiProperty({ example: 'Inter' })
  fontFamily: string;

  @ApiProperty({ example: 'Google Fonts' })
  provider: string;

  @ApiPropertyOptional({ example: 'sans-serif' })
  category?: string | null;

  @ApiPropertyOptional({ example: 400 })
  weightMin?: number | null;

  @ApiPropertyOptional({ example: 700 })
  weightMax?: number | null;

  @ApiProperty({ example: '2026-06-03T10:15:30.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-03T10:15:30.000Z' })
  updatedAt: Date;
}
