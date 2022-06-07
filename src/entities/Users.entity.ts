import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

@Entity({ name: 'tb_user' })
export class Users {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  nickname: string;

  @IsString()
  @Column()
  username: string;

  @IsString()
  @Column({
    unique: true,
  })
  email: string;

  @IsString()
  @Column()
  password: string;

  @IsString()
  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @IsString()
  @Column({ nullable: true })
  socialLoginType: 'google';

  @IsString()
  @Column({ nullable: true })
  socialLoginId: string;
}
