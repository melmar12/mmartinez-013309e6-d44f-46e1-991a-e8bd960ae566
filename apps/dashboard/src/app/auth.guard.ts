import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private auth: AuthService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
