import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interfaces/jwt.payload';

@Injectable()
export class IsUserStrategy extends PassportStrategy(Strategy, 'is-user') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    console.log('hihihi');
    return true;
    // console.log('hi', payload);
    // const user = await this.usersService.findById(payload.uid);
    // if (!user) {
    //   return false;
    // } else {
    //   return true;
    // }
  }
}
