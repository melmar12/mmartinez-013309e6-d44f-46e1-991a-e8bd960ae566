import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTaskDto,
  TaskDto,
  TaskListFilter,
  UpdateTaskDto,
  JwtPayload,
} from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';
import { canAccessOrg } from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/auth';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  private tasks: TaskDto[] = [];

  constructor() {
    // Seed tasks for org-1
    const now = new Date().toISOString();
    this.tasks.push(
      {
        id: 't1',
        title: 'Review access controls',
        description: 'Verify RBAC rules for admin/viewer',
        status: 'in_progress',
        orgId: 'org-1',
        ownerId: '1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 't2',
        title: 'Prepare security report',
        description: 'Summarize audit log events',
        status: 'todo',
        orgId: 'org-1',
        ownerId: '1',
        createdAt: now,
        updatedAt: now,
      },
    );
  }

  private ensureCanRead(user: JwtPayload, orgId: string) {
    if (!canAccessOrg(user, orgId)) {
      throw new ForbiddenException('You cannot access tasks for this org');
    }
  }

  private ensureCanMutate(user: JwtPayload, orgId: string) {
    this.ensureCanRead(user, orgId);

    if (user.role === 'viewer') {
      throw new ForbiddenException(
        'Only admins and owners can modify tasks',
      );
    }
  }

  findAllForUser(user: JwtPayload, filter?: TaskListFilter): TaskDto[] {
    // Org scoping
    let results = this.tasks.filter((task) =>
      canAccessOrg(user, task.orgId),
    );

    if (filter?.status) {
      results = results.filter((t) => t.status === filter.status);
    }

    return results;
  }

  create(user: JwtPayload, dto: CreateTaskDto): TaskDto {
    this.ensureCanMutate(user, user.orgId);

    const now = new Date().toISOString();
    const task: TaskDto = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      status: 'todo',
      orgId: user.orgId,
      ownerId: user.sub,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.push(task);

    // Simple audit log   
    console.log(
      `[AUDIT] user=${user.sub} created task id=${task.id} org=${task.orgId}`,
    );

    return task;
  }

  update(
    user: JwtPayload,
    id: string,
    dto: UpdateTaskDto,
  ): TaskDto {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.ensureCanMutate(user, task.orgId);

    const updated: TaskDto = {
      ...task,
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      status: dto.status ?? task.status,
      updatedAt: new Date().toISOString(),
    };

    this.tasks = this.tasks.map((t) => (t.id === id ? updated : t));

    console.log(
      `[AUDIT] user=${user.sub} updated task id=${task.id} org=${task.orgId}`,
    );

    return updated;
  }

  remove(user: JwtPayload, id: string): void {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.ensureCanMutate(user, task.orgId);

    this.tasks = this.tasks.filter((t) => t.id !== id);

    console.log(
      `[AUDIT] user=${user.sub} deleted task id=${task.id} org=${task.orgId}`,
    );
  }
}
