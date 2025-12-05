# Secure Task Management System (Nx Monorepo)

## Tech Stack

- Nx monorepo
- Backend: NestJS + TypeScript
- Frontend: Angular + TailwindCSS

### Authentication Overview

This project implements JWT-based authentication shared across the NestJS backend and Angular frontend.

## Getting Started
Install dependencies:
```bash
npm install
```
*Due to an upstream peer-dependency mismatch between Nx’s Jest setup (Jest 30)
and `jest-preset-angular@14.6.x`, `npm install` may fail with an `ERESOLVE`
error. This is a known Nx issue.

Workaround:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### How to Test Authentication

Start the backend:
```bash
nx serve api
```

Start the dashboard:
```bash
nx serve dashboard
```

Go to:
```bash
http://localhost:4200/login
```

Use the default seeded credentials:
```bash
email: owner@example.com
password: password123
```
Successful login redirects to the protected dashboard and attaches the JWT to all API calls.


## Project Structure

```bash
apps/
  api/                # NestJS backend
    src/
      app/
        auth/         # AuthModule, JWT strategy, login endpoint
  dashboard/          # Angular frontend
    src/app/
      login/          # Login page
      dashboard/      # Protected dashboard route
      auth.guard.ts
      auth.service.ts
      auth.interceptor.ts

libs/
  data/               # Shared DTOs and auth types
```