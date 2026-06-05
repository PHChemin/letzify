import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssetResponseDto {
  @ApiProperty({ example: '3f3a2c0f-92cc-4a49-a8c5-8e3de7f4f2c1' })
  id: string;

  @ApiProperty({ example: '3f3a2c0f-92cc-4a49-a8c5-8e3de7f4f2c1' })
  projectId: string;

  @ApiProperty({ example: '3f3a2c0f-92cc-4a49-a8c5-8e3de7f4f2c1' })
  uploadedById: string;

  @ApiProperty({ example: 'Logo Principal' })
  name: string;

  @ApiProperty({ example: 'LOGO' })
  assetType: string;

  @ApiProperty({ example: 'https://cdn.letzify.dev/assets/logo.svg' })
  fileUrl: string;

  @ApiProperty({ example: 'projects/project-1/logo.svg' })
  fileKey: string;

  @ApiPropertyOptional({ example: 'image/svg+xml' })
  mimeType?: string | null;

  @ApiPropertyOptional({ example: 2048 })
  fileSizeBytes?: number | null;

  @ApiPropertyOptional({
    example: '3f786850e387550fdab836ed7e6dc881de23001b86c8e6f89b9f8f0f2c8f4f12',
  })
  checksumSha256?: string | null;

  @ApiProperty({ example: '2026-06-03T10:15:30.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-03T10:15:30.000Z' })
  updatedAt: Date;
}
