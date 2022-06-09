import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshCookie = request.cookies?.Refresh;
    console.log('called from useguard', request.cookies?.Refresh);
    //if the user does not have refresh cookie in the first place
    if (!refreshCookie) {
      throw new HttpException(
        'User does not have refresh token',
        HttpStatus.FORBIDDEN,
      );
    }
    return super.canActivate(context);
  }
}
