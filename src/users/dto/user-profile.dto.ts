import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class UserProfileDto {
  @IsBoolean()
  isSnsAgreed: boolean;
}
