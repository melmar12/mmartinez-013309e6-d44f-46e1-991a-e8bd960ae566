# 📌 Secure Task Management System (Nx Monorepo)

A small Nx monorepo implementing a task management system with:

* NestJS API (JWT Auth, RBAC, org scoping, CRUD tasks)

* Angular dashboard (login, health check, tasks UI)

* Shared TypeScript libraries (DTOs, role helpers)

* Fully working local setup + tests

This project was built to demonstrate practical full-stack engineering with clean architecture, modular design, and secure authorization.

---

### 📁 Monorepo Structure

```bash
apps/
  api/           # NestJS backend
    src/app/
      auth/      # JWT auth, controllers, strategies
      tasks/     # Task CRUD with RBAC + org scoping
      app.*      # root app module, controller, service
  dashboard/     # Angular frontend (standalone components)
    src/app/
      dashboard/ # Main dashboard UI
      login/     # Login page
libs/
  data/          # Shared DTOs + interfaces
  auth/          # Shared RBAC utilities (Roles, RolesGuard, org helpers)
```
--- 

### 🏗 Architecture Overview

#### Authentication

* JWT-based (`Bearer <token>`)

* `AuthController` exposes:

  * `POST /auth/login`

  * `GET /auth/me`

* Tokens encode:

  * `sub` (user ID)

  * `email``

  * `role` (owner/admin/viewer)

  * `orgId`

Users are seeded for demo (owner, admin, viewer)

---

### RBAC (Role-Based Access Control)

RBAC implemented through:

* @Roles() decorator

* RolesGuard

* simple role hierarchy:

```pgsql
viewer  -> read-only
admin   -> create/update/delete within org
owner   -> full access to org resources
```

Org scoping guarantees a user can only access entities belonging to their own orgId.

Located in:
`libs/auth/`

---
### Tasks Module

Features:

* List tasks (`GET /tasks`)

* Create task (`POST /tasks`)

* Update task (`PUT /tasks/:id`)

* Delete task (`DELETE /tasks/:id`)

* All operations scoped to user’s org

* Backend stores tasks in-memory (simple for demo)

* Each task includes:

  * title, description, status

  * orgId, ownerId

  * createdAt, updatedAt

Located in:
`apps/api/src/app/tasks/`

---

### Angular Dashboard

The dashboard includes:

#### 🔐 Login page

* Calls `/auth/login`

* Stores token in localStorage

* Adds JWT via interceptor for API calls

#### 📊 Dashboard

* Displays API health via `/health`

* Fetches tasks via `/tasks`

* Create / delete tasks for authorized users

* Viewer role → read-only view

The UI uses standalone components for simplicity and structure.

---
### 🧪 Testing

#### Backend (NestJS + Jest)

Located: `apps/api/src/app/tasks/tasks.service.spec.ts`

Covers:

* Role permissions (viewer/admin/owner)

* Org scoping

* Forbidden actions

* Missing resource errors

#### Frontend (Angular + Jest)

Located: `apps/dashboard/src/app/dashboard/dashboard.component.spec.ts`

Covers:

* Component creation

* Mocked service interactions

* Dashboard initialization behavior

---

### ▶️ Running the Project

#### 1️⃣ Install dependencies
```bash
npm install --legacy-peer-deps
```

#### ️2️⃣ Run the API
```bash
nx serve api
```

Runs on: http://localhost:3000

#### 3️⃣ Run the Angular dashboard
```bash
nx serve dashboard
```

Runs on: http://localhost:4200

---
### 🔌 API Endpoints

#### Auth
| Method | Path        | Description                  |
| ------ | ----------- | ---------------------------- |
| POST   | /auth/login | Authenticate and receive JWT |
| GET    | /auth/me    | Get user info from token     |

#### Tasks
| Method | Path       | Permissions | Description              |
| ------ | ---------- | ----------- | ------------------------ |
| GET    | /tasks     | viewer+     | List tasks in user’s org |
| POST   | /tasks     | admin+      | Create task              |
| PUT    | /tasks/:id | admin+      | Update task              |
| DELETE | /tasks/:id | admin+      | Delete task              |

---

### 🚀 Opportunities for Future Improvements

If this were a production system, next steps would include:

* Postgres / Prisma instead of in-memory storage

* Refresh tokens / rotation strategy

* UI enhancements (status editing, better styling)

* Angular route guards + feature modules

* Audit log persistence

* E2E tests via Nx + Cypress or Playwright