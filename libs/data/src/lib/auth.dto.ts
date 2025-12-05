// libs/data/src/lib/auth.dto.ts

export type Role = 'owner' | 'admin' | 'viewer';

export interface AuthUserDto {
  id: string;
  email: string;
  role: Role;
  orgId: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: AuthUserDto;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: Role;
  orgId: string;
  iat?: number;
  exp?: number;
}
