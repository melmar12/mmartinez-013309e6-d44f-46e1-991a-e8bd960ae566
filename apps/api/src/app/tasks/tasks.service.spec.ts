import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtPayload } from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';

describe('TasksService', () => {
  let service: TasksService;

  const ownerUser: JwtPayload = {
    sub: '1',
    email: 'owner@example.com',
    role: 'owner',
    orgId: 'org-1',
  };

  const viewerUser: JwtPayload = {
    sub: '2',
    email: 'viewer@example.com',
    role: 'viewer',
    orgId: 'org-1',
  };

  const otherOrgUser: JwtPayload = {
    sub: '3',
    email: 'other@example.com',
    role: 'owner',
    orgId: 'org-2',
  };

  beforeEach(() => {
    service = new TasksService();
  });

  it('should allow owner to list tasks in their org', () => {
    const tasks = service.findAllForUser(ownerUser);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.every((t) => t.orgId === ownerUser.orgId)).toBe(true);
  });

  it('should allow viewer to list tasks in their org', () => {
    const tasks = service.findAllForUser(viewerUser);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.every((t) => t.orgId === viewerUser.orgId)).toBe(true);
  });

  it('should not return tasks from other orgs', () => {
    const tasks = service.findAllForUser(otherOrgUser);
    expect(tasks.length).toBe(0);
  });

  it('should allow owner to create tasks in their org', () => {
    const created = service.create(ownerUser, {
      title: 'New task',
      description: 'created by owner',
    });

    expect(created.id).toBeDefined();
    expect(created.orgId).toBe(ownerUser.orgId);

    const tasks = service.findAllForUser(ownerUser);
    expect(tasks.some((t) => t.id === created.id)).toBe(true);
  });

  it('should forbid viewer from creating tasks', () => {
    expect(() =>
      service.create(viewerUser, { title: 'Not allowed' }),
    ).toThrow(ForbiddenException);
  });

  it('should forbid viewer from deleting tasks', () => {
    const [existing] = service.findAllForUser(ownerUser);
    expect(existing).toBeDefined();

    expect(() => service.remove(viewerUser, existing.id)).toThrow(
      ForbiddenException,
    );
  });

  it('should throw NotFoundException when deleting missing task', () => {
    expect(() =>
      service.remove(ownerUser, 'non-existent-id'),
    ).toThrow(NotFoundException);
  });
});
