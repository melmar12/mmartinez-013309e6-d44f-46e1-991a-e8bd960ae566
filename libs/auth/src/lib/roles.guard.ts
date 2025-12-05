import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';

// Simple role hierarchy: owner > admin > viewer
const roleRank: Record<Role, number> = {
  owner: 3,
  admin: 2,
  viewer: 1,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // No @Roles() metadata → no role restriction; allow through
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: Role } | undefined;

    if (!user?.role) {
      return false;
    }

    const userRank = roleRank[user.role];
    if (userRank === undefined) {
      return false;
    }

    // User is allowed if their rank >= any required role’s rank
    return requiredRoles.some((role) => {
      const requiredRank = roleRank[role];
      return requiredRank !== undefined && userRank >= requiredRank;
    });
  }
}
