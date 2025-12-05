import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface HealthResponse {
  status: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private apiBase = 'http://localhost:3000';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.apiBase}/health`);
  }
}
