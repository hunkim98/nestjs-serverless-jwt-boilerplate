import { IsNotEmpty, IsString } from 'class-validator';
import { Users } from '../../entities/users.entity';

export class GoogleAuthBodyDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class GoogleAuthResDto {
  user: Users;
  email: string;
}