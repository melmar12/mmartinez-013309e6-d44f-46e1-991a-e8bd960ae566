import { Role } from './auth.dto';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  orgId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskListFilter {
  status?: TaskStatus;
}

export interface TaskWithOwnerRole extends TaskDto {
  ownerRole?: Role;
}
