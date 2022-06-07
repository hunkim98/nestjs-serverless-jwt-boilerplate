import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IUsers } from '../users/interfaces/users.interface';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.payload';
import { LoginDto } from './dto/login.dto';
import { Users } from 'src/users/entities/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  public async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  private async validate(loginDto: LoginDto): Promise<IUsers> {
    return await this.usersService.findByEmail(loginDto.email);
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<any | { status: number; message: string }> {
    return this.validate(loginDto)
      .then((userData) => {
        if (!userData) {
          throw new UnauthorizedException();
        }

        const passwordIsValid = bcrypt.compareSync(
          loginDto.password,
          userData.password,
        );

        if (!passwordIsValid == true) {
          return {
            message: 'Authentication failed. Wrong password',
            status: 400,
          };
        }

        const payload = {
          name: userData.name,
          email: userData.email,
          id: userData.id,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
          expiresIn: 3600,
          accessToken: accessToken,
          user: payload,
          status: 200,
        };
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });
  }

  public async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return this.createJwtPayload(user);
  }

  protected createJwtPayload(user: Users) {
    const data: JwtPayload = {
      uid: user.id,
      email: user.email,
    };

    const jwt = this.jwtService.sign(data);

    return {
      expiresIn: 3600,
      token: jwt,
    };
  }

  getCookieWithJwtAccessToken(user: Users) {
    const payload = { uid: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return {
      accessToken: token,
      domain: this.configService.get<string>('DOMAIN'),
      path: '/',
      httpOnly: true,
      maxAge:
        Number(
          this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        ) * 1000,
    };
  }

  getCookieWithJwtRefreshToken(user: Users) {
    const payload = { uid: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return {
      refreshToken: token,
      domain: this.configService.get<string>('DOMAIN'),
      path: '/',
      httpOnly: true,
      maxAge:
        Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) *
        1000,
    };
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: this.configService.get<string>('DOMAIN'),
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: this.configService.get<string>('DOMAIN'),
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }
}
function hash(refreshToken: string, arg1: number) {
  throw new Error('Function not implemented.');
}
