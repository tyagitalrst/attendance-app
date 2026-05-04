# Attendance App

A microservices-based attendance tracking system with role-based access, event-driven architecture, and real-time admin notifications.

You can access the attendance application in here: [https://attendance-app-tyagitalrst-projects.vercel.app/](https://attendance-app-tyagitalrst-projects.vercel.app/)
And application for monitoring employee, you can access in here: [https://monitoring-app-tyagitalrst-projects.vercel.app/](https://monitoring-app-tyagitalrst-projects.vercel.app/)

## Architecture

Three NestJS services communicating via RabbitMQ, with separate databases for application data and audit logs.

### Services

- **attendance-service** — Auth (JWT), clock in/out, profile management
- **monitor-service** — Admin operations (user CRUD, attendance overview), Firebase Cloud Messaging
- **logger-service** — Catch-all event consumer writing to a separate audit DB

### Why this design

- **Event-driven via RabbitMQ topic exchange**: services publish domain events; consumers react independently. Adding a new consumer requires zero changes to publishers.
- **Two databases**: app data and audit logs are physically isolated for performance, retention, and compliance separation.
- **Shared JWT secret across services**: a single login token works system-wide.
- **Defense in depth**: bcrypt password hashing, validation pipes with whitelist mode (prevents mass assignment), role guards, password fields stripped at the DB query level.

## Tech Stack

| Layer            | Tech                                    |
| ---------------- | --------------------------------------- |
| Backend          | NestJS, TypeScript, Prisma ORM          |
| Database         | PostgreSQL 16                           |
| Message Broker   | RabbitMQ 3                              |
| Notifications    | Firebase Cloud Messaging                |
| Frontend         | React + Vite + TypeScript + Tailwind v4 |
| Auth             | JWT (HS256) + bcrypt                    |
| Containerization | Docker Compose                          |

## Setup

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- A Firebase project (for notifications) — optional, app gracefully degrades without it

### 1. Clone and install

```bash
git clone <this-repo>
cd attendance-app

# Install all service dependencies
cd services/attendance-service && npm install && cd ../..
cd services/monitor-service && npm install && cd ../..
cd services/logger-service && npm install && cd ../..

# Install frontend dependencies
cd frontend/attendance-app && npm install && cd ../..
cd frontend/monitoring-app && npm install && cd ../..
```

### 2. Start infrastructure (Postgres x2, RabbitMQ)

```bash
cd infrastructure
docker-compose up -d
```

### 3. Configure environment

Copy `.env.example` to `.env` in each service and frontend folder, then fill in values.

For Firebase (admin notifications), create a project at firebase.google.com, generate a service account key, and place at `services/monitor-service/secrets/firebase-admin.json`. Without it, the app still runs — notifications just disabled.

### 4. Run database migrations

```bash
cd services/attendance-service
npx prisma migrate dev
npx prisma db seed   # creates first admin: admin@mail.com/DemoAdmin123

cd ../logger-service
npx prisma migrate dev
```

### 5. Start everything

In separate terminals:

```bash
cd services/attendance-service && npm run start:dev    # :3000
cd services/monitor-service && npm run start:dev       # :3001
cd services/logger-service && npm run start:dev        # :3002
cd frontend/attendance-app && npm run dev              # :5173
cd frontend/monitoring-app && npm run dev              # :5174
```

## Default Credentials

- Admin: `admin@mail.com` / `DemoAdmin123` (from seed)
- Register employees via `POST /admin/users` or via admin UI

## API Surface

| Service    | Endpoint                        | Description                   |
| ---------- | ------------------------------- | ----------------------------- |
| attendance | `POST /auth/register`           | Register new employee         |
| attendance | `POST /auth/login`              | Get JWT                       |
| attendance | `GET /profile`                  | Current user                  |
| attendance | `PATCH /profile`                | Update photo, phone, password |
| attendance | `POST /attendances/clock-in`    |                               |
| attendance | `PATCH /attendances/clock-out`  |                               |
| attendance | `GET /attendances`              | Own history                   |
| monitor    | `GET /admin/users`              | List employees                |
| monitor    | `POST /admin/users`             | Create employee (any role)    |
| monitor    | `PATCH /admin/users/:id`        | Update employee               |
| monitor    | `DELETE /admin/users/:id`       | Delete employee               |
| monitor    | `GET /admin/attendance`         | All records                   |
| monitor    | `POST /notifications/subscribe` | Subscribe FCM token           |
| logger     | `GET /logs`                     | Audit trail (admin only)      |

## Events

Published on RabbitMQ exchange `attendance.events` (topic):

- `user.clocked_in`
- `user.clocked_out`
- `user.profile_updated`
- `user.created`
- `user.updated`
- `user.deleted`

## Project Structure

attendance-app/
├── infrastructure/
│ └── docker-compose.yml
├── services/
│ ├── attendance-service/ # NestJS, port 3000
│ ├── monitor-service/ # NestJS, port 3001
│ └── logger-service/ # NestJS, port 3002
└── frontend/
| ├── attendance-app/ # Vite + React, port 5173
| └── monitoring-app/ # Vite + React, port 5174

## Deployment

The production stack uses **Render** (backends), **Supabase** (databases), **CloudAMQP** (RabbitMQ), and **Vercel** (frontends) — all on free tiers.

### Infrastructure (provision first)

| Service           | Provider                           | Notes                                        |
| ----------------- | ---------------------------------- | -------------------------------------------- |
| PostgreSQL (main) | [Supabase](https://supabase.com)   | Used by attendance-service + monitor-service |
| PostgreSQL (logs) | [Supabase](https://supabase.com)   | Used by logger-service only                  |
| RabbitMQ          | [CloudAMQP](https://cloudamqp.com) | Free "Little Lemur" plan                     |

> **Supabase connection**: Use the **Session pooler** URL (not Direct connection) — Render's free tier is IPv4-only.

### Render Free Tier — Known Limitations

| # | Limitation | Impact |
|---|-----------|--------|
| 1 | **Cold starts** — services spin down after ~15 min of inactivity | First request after idle takes 30–60 s to wake up |
| 2 | **750 free hours/month shared** across all services | 3 backend services × 24 h = exceeds free quota; services may be paused |
| 3 | **No persistent disk** on free tier | Cannot store uploaded files locally; must use external storage (S3, Cloudinary) |
| 4 | **IPv4-only** — no outbound IPv6 | Must use Session Pooler on Supabase instead of Direct connection |
| 5 | **Auto-deploy on every push** | Can burn build minutes quickly on active branches |
| 6 | **512 MB RAM / shared CPU** | Not suitable for CPU-heavy or memory-intensive workloads |


## Future Improvements

- **Object storage** (S3/Cloudinary) for profile photos instead of URL-only
- **Cron job** for marking INCOMPLETE records (users who forgot to clock out)
