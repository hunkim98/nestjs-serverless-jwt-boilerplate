import { Role } from '@prisma/client';

export class VerifiedUserResDto {
  accessToken: string;
  isEmailVerified: boolean;
  role: Role;
  email: string;
  name: string;
  telephone: string;
}
