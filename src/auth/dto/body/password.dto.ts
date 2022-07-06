import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;
}
