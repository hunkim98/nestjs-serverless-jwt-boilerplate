import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  @IsNotEmpty()
  @IsString()
  readonly newPassword1: string;

  @IsNotEmpty()
  @IsString()
  readonly newPassword2: string;
}
