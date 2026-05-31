import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}
