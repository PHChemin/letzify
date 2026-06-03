import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../enums/project-status.enum';

export class ProjectResponseDto {
  @ApiProperty({ example: '3f3a2c0f-92cc-4a49-a8c5-8e3de7f4f2c1' })
  id: string;

  @ApiProperty({ example: '3f3a2c0f-92cc-4a49-a8c5-8e3de7f4f2c1' })
  ownerId: string;

  @ApiProperty({ example: 'Brandbook 2026' })
  name: string;

  @ApiProperty({ example: 'brandbook-2026' })
  slug: string;

  @ApiPropertyOptional({
    example: 'Projeto de identidade visual da campanha 2026',
  })
  description?: string | null;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ALIGNMENT })
  status: ProjectStatus;

  @ApiProperty({ example: '2026-06-03T10:15:30.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-03T10:15:30.000Z' })
  updatedAt: Date;
}
