import { ApiProperty } from '@nestjs/swagger';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';

export class DashboardStatsDto {
  @ApiProperty({ example: 12 })
  totalProjects: number;

  @ApiProperty({ example: 48 })
  totalPalettes: number;

  @ApiProperty({ example: 156 })
  totalAssets: number;

  @ApiProperty({ example: 24 })
  totalTypographies: number;

  @ApiProperty({ type: ProjectResponseDto, isArray: true })
  recentProjects: ProjectResponseDto[];
}
