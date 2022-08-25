import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
  Type,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import RequestWithUser from '../../auth/interfaces/request-with-user.interface';
import { JwtGuard } from './jwt.guard';

const RoleGuard = (requiredRoles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      if (!user) {
        throw new ForbiddenException('User does not exist');
      }
      return requiredRoles.some((role) => user.role.includes(role));
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
//https://wanago.io/2021/11/15/api-nestjs-authorization-roles-claims/
