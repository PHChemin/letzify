import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserDto {
  @ApiProperty({ example: '3f3a2c0f-92cc-4a49-a8c5-8e3de7f4f2c1' })
  id: string;

  @ApiProperty({ example: 'designer@letzify.com' })
  email: string;

  @ApiPropertyOptional({ example: 'Designer Letzify' })
  name?: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ enum: Role, isArray: true, example: ['USER'] })
  roles: Role[];

  @ApiProperty({ example: '2026-06-03T10:15:30.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-03T10:15:30.000Z' })
  updatedAt: Date;
}
