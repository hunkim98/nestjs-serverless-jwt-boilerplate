import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
} from 'class-validator';
/** Remember to update this dto to match it with User entity */
export class UserDto {
  @IsString()
  @MaxLength(30)
  readonly nickname: string;

  @IsString()
  @MaxLength(40)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;

  @IsOptional()
  readonly socialLoginType: 'google';

  @IsOptional()
  readonly socialLoginId: string;
}
