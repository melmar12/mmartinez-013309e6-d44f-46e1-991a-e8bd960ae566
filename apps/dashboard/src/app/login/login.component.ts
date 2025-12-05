import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = 'owner@example.com';
  password = 'password123';
  loading = false;
  error: string | null = null;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private auth: AuthService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router,
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = null;

    this.auth
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Invalid credentials';
          this.loading = false;
        },
      });
  }
}
