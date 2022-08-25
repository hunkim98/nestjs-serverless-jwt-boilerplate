import { User } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthBodyDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class GoogleAuthResDto {
  user: User;
  email: string;
}
