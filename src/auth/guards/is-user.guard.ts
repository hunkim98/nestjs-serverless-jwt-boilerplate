import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class IsUserGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    // console.log(user);
    if (err) {
      return false;
    }
    return user;
  }
}
