# Secure Task Management System (Nx Monorepo)

## Tech Stack

- Nx monorepo
- Backend: NestJS + TypeScript
- Frontend: Angular + TailwindCSS

## Getting Started

```bash
npm install

# Run backend (NestJS)
npx nx serve api   # http://localhost:3000/health

# Run frontend (Angular)
npx nx serve dashboard  # http://localhost:4200
```

### *Installing dependencies
Due to an upstream peer-dependency mismatch between Nx’s Jest setup (Jest 30)
and `jest-preset-angular@14.6.x`, `npm install` may fail with an `ERESOLVE`
error. This is a known Nx issue.

Workaround:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

```