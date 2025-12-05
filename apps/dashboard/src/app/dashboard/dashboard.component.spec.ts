import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { HealthService } from '../health.service';
import { TasksService } from '../tasks.service';
import { TaskDto } from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';

class MockHealthService {
  getHealth() {
    return of({ status: 'ok', timestamp: '2025-01-01T00:00:00.000Z' });
  }
}

class MockTasksService {
  list() {
    const now = new Date().toISOString();
    const tasks: TaskDto[] = [
      {
        id: 't1',
        title: 'Test task',
        description: 'From mock',
        status: 'todo',
        orgId: 'org-1',
        ownerId: '1',
        createdAt: now,
        updatedAt: now,
      },
    ];
    return of(tasks);
  }

  create() {
    return of();
  }

  update() {
    return of();
  }

  delete() {
    return of();
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: HealthService, useClass: MockHealthService },
        { provide: TasksService, useClass: MockTasksService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
