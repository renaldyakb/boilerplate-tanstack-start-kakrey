# TanStack Start Boilerplate Collection 🚀

A comprehensive collection of production-ready boilerplates for **TanStack Start**, designed to kickstart your full-stack React applications with modern best practices.

Featuring integrations with **Drizzle ORM**, **Prisma**, **Better Auth**, and **PostgreSQL**.

## 🚀 Quick Start

The fastest way to get started is by using our interactive CLI. Run the following command in your terminal:

```bash
npx github:renaldyakb/boilerplate-tanstack-start-kakrey
```

This will launch an interactive wizard that guides you through:

1.  Selecting your preferred technology stack.
2.  Naming your project.
3.  Cloning the template ready for development.

## 📦 Available Templates

Choose the stack that best fits your needs:

| Template Name        | ORM     | Auth        | Database   | Description                                                          |
| :------------------- | :------ | :---------- | :--------- | :------------------------------------------------------------------- |
| **Complete Drizzle** | Drizzle | Better Auth | PostgreSQL | **(Recommended)** Full-stack starter with rigorous type safety.      |
| **Complete Prisma**  | Prisma  | Better Auth | PostgreSQL | **(Popular)** Full-stack starter with the friendly Prisma ecosystem. |
| **Simple Drizzle**   | Drizzle | -           | PostgreSQL | Lightweight wrapper for Drizzle and PG. No Auth.                     |
| **Simple Prisma**    | Prisma  | -           | PostgreSQL | Lightweight wrapper for Prisma and PG. No Auth.                      |
| **Minimal tRPC**     | -       | -           | -          | Minimal setup with just tRPC + React Query.                          |

| **Minimal tRPC** | - | - | - | Minimal setup with just tRPC + React Query. |

## ✨ Perfect for "Vibe-Coding"

Designed for developers (and AI agents) who crave **consistency** and **flow**:

- **🧘‍♂️ Zero Mental Overhead**: Every template follows the exact same "Feature-Based" folder structure (`src/features`, `src/routes`, `src/server`). Switch stacks without switching mental models.
- **🤖 AI-Optimized**: The codebase is structured to be easily understood by LLMs (Cursor, Windsurf, Copilot). Context retrieval is efficient, leading to smarter AI suggestions.
- **🧠 AI_RULES.md Included**: Each boilerplates comes with a comprehensive `AI_RULES.md` file. This is your "Context Prompts" ready to copy-paste into your AI editor. It ensures the AI writes code that follows _our_ project standards (e.g. using `useSuspenseQuery` instead of `useQuery`).
- **🛡️ Production-Grade Guardrails**:
  - **Strict Env Validation**: App won't start if `.env` is wrong.
  - **Type-Safe Everywhere**: From database to frontend component.
  - **Linting & Formatting**: Pre-configured ESLint and Prettier for automatic consistency.
- **🎨 Instant Aesthetics**: Don't waste "vibe" time setting up Tailwind. It's already there with Shadcn UI, ready for you to build beautiful things immediately.

## 🛠️ Common Features

All templates share a solid foundation based on the latest React ecosystem:

- **⚡ Framework**: [TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview) (Server-Side Rendering, File-based Routing)
- **🎨 UI**: [Tailwind CSS v4](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com)
- **🔄 Data Fetching**: [TanStack Query](https://tanstack.com/query) + [tRPC](https://trpc.io)
- **🛡️ Type Safety**: End-to-end type safety with TypeScript and Zod.
- **🐳 Docker**: Ready-to-use `docker-compose.yml` for local database development.

## 🏁 Post-Installation

After creating your project, follow these general steps (specific instructions are in each project's README):

1.  **Enter directory**: `cd <your-project-name>`
2.  **Install dependencies**: `npm install`
3.  **Setup Environment**: `cp .env.example .env`
4.  **Start Database**: `npm run db:up`
5.  **Push Schema**: `npm run db:push`
6.  **Start Dev Server**: `npm run dev`

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have suggestions for improvements or new templates.

## 📄 License

MIT © [Renaldy Akbar](https://github.com/renaldyakb)
