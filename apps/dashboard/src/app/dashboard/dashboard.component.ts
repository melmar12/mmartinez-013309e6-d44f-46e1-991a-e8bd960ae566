import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HealthService } from '../health.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  title = 'Secure Task Management Dashboard';
  healthStatus: string | null = null;
  healthTimestamp: string | null = null;
  loading = false;
  error: string | null = null;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.checkHealth();
  }

  checkHealth() {
    this.loading = true;
    this.error = null;

    this.healthService.getHealth().subscribe({
      next: (res) => {
        this.healthStatus = res.status;
        this.healthTimestamp = res.timestamp;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to reach API';
        console.error(err);
        this.loading = false;
      },
    });
  }
}
