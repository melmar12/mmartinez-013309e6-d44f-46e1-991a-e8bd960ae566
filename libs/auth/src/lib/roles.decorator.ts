import { SetMetadata } from '@nestjs/common';
import { Role } from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
