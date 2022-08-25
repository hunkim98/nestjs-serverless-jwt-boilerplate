import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleService } from './google.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthService } from './auth.service';
import { RegisterService } from './register.service';
import { IsUserStrategy } from './strategies/is-user.strategy';
import { PasswordService } from './password.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [ConfigModule, MailerModule, PassportModule, JwtModule.register({})],
  providers: [
    LoginService,
    UsersService,
    JwtStrategy,
    GoogleService,
    AuthService,
    JwtRefreshStrategy,
    IsUserStrategy,
    RegisterService,
    PasswordService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
