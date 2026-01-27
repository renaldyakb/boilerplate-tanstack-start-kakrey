# Modern TanStack Starter

A production-ready boilerplate built with the latest React 19 ecosystem. Features **TanStack Router**, **TanStack Query**, **tRPC**, **Drizzle ORM**, and **Shadcn UI** (Tailwind CSS v4).

## 🚀 Tech Stack

- **Framework**: [TanStack Router](https://tanstack.com/router) (File-based routing)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) + [tRPC](https://trpc.io)
- **Database**: [Prisma ORM](https://www.prisma.io) + PostgreSQL
- **UI**: [Shadcn UI](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com)
- **Validation**: [Zod](https://zod.dev) (API & Env)
- **Dark Mode**: [Next Themes](https://github.com/pacocoursey/next-themes)

## 🛠️ Features

- **Full Type Safety**: End-to-end type safety from database to UI.
- **Strict Env Validation**: App won't start if env vars are missing (`src/lib/env.ts`).
- **Modular Architecture**: Feature-based folder structure.
- **Optimistic Updates**: Built-in mutation handling patterns.
- **Dark Mode**: System-aware theme toggle included.

## 🏁 Getting Started

### 1. Create Project

**Option A: Using npx (Recommended)**

```bash
npx degit renaldyakb/boilerplate-kakrey-tanstack/tanstack-start-prisma-pg my-app
cd my-app
npm install
```

**Option B: Manual Clone**

```bash
git clone [repo-url]
cd [project-name]
npm install
```

### 2. Setup Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `DATABASE_URL` with your PostgreSQL connection string.

### 3. Database Migration

Push the schema to your database:

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`.

## 📜 Scripts

| Script                | Description                    |
| :-------------------- | :----------------------------- |
| `npm run dev`         | Start development server       |
| `npm run build`       | Build for production           |
| `npm run start`       | Start production server        |
| `npm run check`       | Run TypeScript & ESLint checks |
| `npm run db:generate` | Generate migration files       |
| `npm run db:push`     | Push schema changes to DB      |
| `npm run db:migrate`  | Run pending migrations         |
| `npm run db:studio`   | Open Drizzle Studio            |

## 📁 Project Structure

```
src/
├── components/ui/       # Shadcn components
├── features/            # Feature modules (e.g. todos)
├── lib/                 # Utilities (env, toast, etc)
├── routes/              # Pages (TanStack Router)
├── server/
│   ├── db/              # Prisma client instance
│   └── trpc/            # Back-end logic
└── router.tsx           # Router configuration
prisma/
└── schema.prisma        # Database schema
```
