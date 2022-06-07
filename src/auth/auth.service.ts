import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { Users } from '../entities/users.entity';
import { Tokens } from './dto/token.dto';
import { JwtPayload } from './interfaces/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        )}s`,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        )}s`,
      }),
    ]);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  public getCookieWithJwtAccessToken(
    user: Users,
  ): CookieOptions & { accessToken: string } {
    const payload = { uid: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return {
      accessToken: token,
      // domain: this.configService.get('DOMAIN'),
      path: '/',
      httpOnly: true,
      maxAge: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    };
  }

  public getCookieWithJwtRefreshToken(
    user: Users,
  ): CookieOptions & { refreshToken: string } {
    const payload = { uid: user.id, email: user.email };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return {
      refreshToken,
      // domain: this.configService.get('DOMAIN'),
      path: '/',
      httpOnly: true,
      maxAge: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    };
  }

  public getCookiesForLogOut() {
    return {
      // domain: this.configService.get('DOMAIN'),
      path: '/',
      httpOnly: true,
      maxAge: 0,
    };
  }
}
