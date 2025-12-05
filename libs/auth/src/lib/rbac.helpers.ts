import { JwtPayload } from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';

export function canAccessOrg(user: JwtPayload, targetOrgId: string): boolean {
  return user.orgId === targetOrgId;
}
