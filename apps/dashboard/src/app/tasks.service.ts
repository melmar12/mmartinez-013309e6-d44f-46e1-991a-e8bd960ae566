import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TaskDto,
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
} from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private apiBase = 'http://localhost:3000';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  list(status?: TaskStatus): Observable<TaskDto[]> {
    const params = status ? { status } : undefined;
    return this.http.get<TaskDto[]>(`${this.apiBase}/tasks`, { params });
  }

  create(dto: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(`${this.apiBase}/tasks`, dto);
  }

  update(id: string, dto: UpdateTaskDto): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${this.apiBase}/tasks/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/tasks/${id}`);
  }
}
