import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  AuthUserDto,
  JwtPayload,
  LoginRequestDto,
  LoginResponseDto,
  Role,
} from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';

interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  orgId: string;
}

// In-memory "DB" for now.
// TODO: replace with real TypeORM entities.
const users: UserRecord[] = [
  {
    id: '1',
    email: 'owner@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'owner',
    orgId: 'org-1',
  },
  {
    id: '2',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'admin',
    orgId: 'org-1',
  },
  {
    id: '3',
    email: 'viewer@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'viewer',
    orgId: 'org-1',
  },
  {
    id: '4',
    email: 'owner2@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'owner',
    orgId: 'org-2',
  }

];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private toAuthUserDto(user: UserRecord): AuthUserDto {
    const { id, email, role, orgId } = user;
    return { id, email, role, orgId };
  }

  async validateUser(email: string, password: string): Promise<AuthUserDto | null> {
    const user = users.find((u) => u.email === email);
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;

    return this.toAuthUserDto(user);
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user,
    };
  }
}
