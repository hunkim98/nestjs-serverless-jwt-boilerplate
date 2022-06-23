import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [MailerModule],
  providers: [ForgotPasswordService, UsersService],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
