import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly password: string;
}

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
