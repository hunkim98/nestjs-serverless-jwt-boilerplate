import { IsNotEmpty, IsString } from 'class-validator';

export class PostNicknameDto {
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;
}
