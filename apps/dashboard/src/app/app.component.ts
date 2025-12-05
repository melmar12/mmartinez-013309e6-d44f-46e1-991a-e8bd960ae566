import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HealthService } from './health.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
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
