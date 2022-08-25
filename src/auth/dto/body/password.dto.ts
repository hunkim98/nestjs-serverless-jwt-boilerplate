import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class PostPasswordDto {
  @IsString()
  readonly password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;
}
