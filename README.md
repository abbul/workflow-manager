# Workflow Manager

A full-stack application to manage alert workflows built with NestJS, tRPC, Next.js, and Prisma.

## Features
- **Workflow Management**: Create, list, and toggle workflows (Threshold & Variance types).
- **tRPC API**: Type-safe communication between frontend and backend with Zod validation.
- **Next.js App Router**: Modern frontend architecture.
- **Prisma ORM**: SQLite database integration.
- **Manual Simulation**: Trigger workflows directly from the UI.
- **Execution History**: Paginated history with filtering by status.
- **Extra - Snooze**: Postpone alerts for X minutes.
- **Extra - Comments**: Add notes when resolving executions.

## Prerequisites
- Node.js (v18+)
- npm

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with DATABASE_URL="file:./dev.db"
# Run migrations
npx prisma migrate dev --name init
# Seed database
npx prisma db seed
# Start backend
npm run start:dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start frontend
npm run dev
```

The application will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API (tRPC): [http://localhost:3001/trpc](http://localhost:3001/trpc)

## Usage
1. Go to **Workflows** to see active alerts.
2. Use the **Simulate** input to test a workflow (e.g., enter `45` for "High Temp Alert").
3. Go to **History** to see triggered executions.
4. Click **Resolve** to close an execution and add a comment.
5. Use **Snooze** on the Workflows page to temporarily disable triggers.
