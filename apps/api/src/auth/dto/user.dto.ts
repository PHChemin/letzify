import { Role } from '@prisma/client';

export class UserDto {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}
