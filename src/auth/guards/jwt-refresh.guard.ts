import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { parseCookieString } from '../../utils/parseCookieString';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshCookie = request.cookies?.Refresh;
    //interestingly, when deployed to serverless the upper one does not work
    const parsedRefreshCookie = request.headers.cookie
      ? parseCookieString(request.headers.cookie)?.Refresh
      : '';
    //if the user does not have refresh cookie in the first place
    if (!refreshCookie && !parsedRefreshCookie) {
      throw new HttpException(
        'User does not have refresh token',
        HttpStatus.FORBIDDEN,
      );
    }
    return super.canActivate(context);
  }
}
