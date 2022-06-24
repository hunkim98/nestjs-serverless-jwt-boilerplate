import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
/** Remember to update this dto to match it with User entity */
export class UserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MaxLength(30)
  readonly nickname: string;

  @IsString()
  @MaxLength(30)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;

  @IsBoolean()
  isTermsAgreed: boolean;

  @IsBoolean()
  isSnsAgreed: boolean;

  @IsOptional()
  readonly socialLoginType: SocialLoginType;

  @IsOptional()
  readonly socialLoginId: string;
}

enum SocialLoginType {
  GOOGLE = 'GOOGLE',
}
