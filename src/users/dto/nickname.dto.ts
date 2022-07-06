import { IsNotEmpty, IsString } from 'class-validator';

export class IsNicknameUsedBodyDto {
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;
}
