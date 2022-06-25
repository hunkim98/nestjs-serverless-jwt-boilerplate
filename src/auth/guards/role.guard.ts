import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import { JwtGuard } from './jwt.guard';

const matchRoles = (roles: number[], userRole: number) => {
  return roles.some((role) => role === userRole);
};

const RoleGuard = (roles: number[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      if (!user) {
        throw new ForbiddenException('User does not exist');
      }
      return matchRoles(roles, user.membershipLevel);
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
//https://wanago.io/2021/11/15/api-nestjs-authorization-roles-claims/
