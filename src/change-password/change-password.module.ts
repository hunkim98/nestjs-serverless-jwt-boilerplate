import { Module } from '@nestjs/common';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [MailerModule],
  controllers: [ChangePasswordController],
  providers: [ChangePasswordService, UsersService],
})
export class ChangePasswordModule {}
