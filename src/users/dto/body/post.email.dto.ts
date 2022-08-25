import { IsString } from 'class-validator';

export class PostEmailDto {
  @IsString()
  nickname: string;
}
