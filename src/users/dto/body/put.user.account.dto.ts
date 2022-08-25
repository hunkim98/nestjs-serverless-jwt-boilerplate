import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class PutUserAccountDto {
  @IsBoolean()
  isSnsAgreed: boolean;

  @IsString()
  telephone: string;
}
