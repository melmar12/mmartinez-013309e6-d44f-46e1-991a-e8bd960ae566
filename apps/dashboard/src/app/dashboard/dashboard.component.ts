import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HealthService } from '../health.service';
import { TasksService } from '../tasks.service';
import { TaskDto } from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  title = 'Secure Task Management Dashboard';

  // Health state
  healthStatus: string | null = null;
  healthTimestamp: string | null = null;
  healthLoading = false;
  healthError: string | null = null;

  // Tasks state
  tasks: TaskDto[] = [];
  tasksLoading = false;
  tasksError: string | null = null;

  newTaskTitle = '';
  newTaskDescription = '';
  isLoggedIn = false;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private healthService: HealthService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private tasksService: TasksService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private auth: AuthService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();

    if (!this.isLoggedIn) {
      // redirect if not authenticated
      // this.router.navigate(['/login']);
    }

    this.checkHealth();
    this.loadTasks();
  }

  checkHealth() {
    this.healthLoading = true;
    this.healthError = null;

    this.healthService.getHealth().subscribe({
      next: (res) => {
        this.healthStatus = res.status;
        this.healthTimestamp = res.timestamp;
        this.healthLoading = false;
      },
      error: (err) => {
        this.healthError = 'Failed to reach API';
        console.error(err);
        this.healthLoading = false;
      },
    });
  }

  loadTasks() {
    this.tasksLoading = true;
    this.tasksError = null;

    this.tasksService.list().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.tasksLoading = false;
      },
      error: (err) => {
        this.tasksError = 'Failed to load tasks';
        console.error(err);
        this.tasksLoading = false;
      },
    });
  }

  createTask() {
    if (!this.newTaskTitle.trim()) return;

    const dto = {
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim() || undefined,
    };

    this.tasksService.create(dto).subscribe({
      next: (created) => {
        this.tasks.push(created);
        this.newTaskTitle = '';
        this.newTaskDescription = '';
      },
      error: (err) => {
        console.error(err);
        this.tasksError = 'Failed to create task';
      },
    });
  }

  deleteTask(task: TaskDto) {
    if (!confirm(`Delete task "${task.title}"?`)) return;

    this.tasksService.delete(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
      },
      error: (err) => {
        console.error(err);
        this.tasksError = 'Failed to delete task';
      },
    });
  }

  markDone(task: TaskDto) {
    if (task.status === 'done') return;

    this.tasksService
      .update(task.id, { status: 'done' })
      .subscribe({
        next: (updated) => {
          this.tasks = this.tasks.map((t) =>
            t.id === updated.id ? updated : t,
          );
        },
        error: (err) => {
          console.error(err);
          this.tasksError = 'Failed to update task';
        },
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
