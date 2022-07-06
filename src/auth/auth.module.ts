import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleService } from './google.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthService } from './auth.service';
import { RegisterService } from './register.service';
import { UsersModule } from 'src/users/users.module';
import { IsUserStrategy } from './strategies/is-user.strategy';
import { PasswordService } from './password.service';

@Module({
  imports: [
    ConfigModule,
    // TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.register({}),
  ],
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
