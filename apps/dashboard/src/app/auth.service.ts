import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  LoginRequestDto,
  LoginResponseDto,
} from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data'; // adjust scope if needed
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBase = 'http://localhost:3000';

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private http: HttpClient,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router,
  ) {}

  login(credentials: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http
      .post<LoginResponseDto>(`${this.apiBase}/auth/login`, credentials)
      .pipe(
        tap((res) => {
          this.setToken(res.accessToken);
        }),
      );
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    this.clearToken();
    this.router.navigate(['/login']);
  }
}
