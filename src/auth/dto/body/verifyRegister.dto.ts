import { IsString } from 'class-validator';

export class VerifyRegisterDto {
  @IsString()
  readonly code: string;
}
