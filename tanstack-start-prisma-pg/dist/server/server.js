import path from "node:path";
import url from "node:url";
import * as fs from "node:fs";
import express from "express";
import { config } from "dotenv";
import { z } from "zod";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
config();
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});
const getEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 4)
    );
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
};
const env = getEnv();
const createTRPCContext = ({
  req,
  res
}) => {
  return {
    req,
    res
  };
};
const t = initTRPC.context().create({
  /**
   * Error formatter for better error messages in development.
   *
   * @see https://trpc.io/docs/server/error-formatting
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Include stack trace only in development
        stack: process.env.NODE_ENV === "development" && error.cause instanceof Error ? error.cause.stack : void 0
      }
    };
  }
});
const createTRPCRouter = t.router;
t.createCallerFactory;
t.mergeRouters;
const baseProcedure = t.procedure;
const middleware = t.middleware;
const loggerMiddleware = middleware(async ({ path: path2, type, next }) => {
  const start = Date.now();
  console.log(`[tRPC] ${path2} ${type} started`);
  const result = await next();
  const durationMs = Date.now() - start;
  const status = result.ok ? "success" : "error";
  console.log(
    `[tRPC] ${path2} ${type} completed in ${durationMs}ms - ${status}`
  );
  return result;
});
const SLOW_QUERY_THRESHOLD_MS = 1e3;
const timingMiddleware = middleware(async ({ path: path2, next }) => {
  const start = performance.now();
  const result = await next();
  const durationMs = performance.now() - start;
  if (durationMs > SLOW_QUERY_THRESHOLD_MS) {
    console.warn(
      `[tRPC] ⚠️ Slow query detected: ${path2} took ${durationMs.toFixed(2)}ms`
    );
  }
  return result;
});
const publicProcedure = baseProcedure.use(loggerMiddleware).use(timingMiddleware);
baseProcedure.use(loggerMiddleware).use(timingMiddleware);
const helloRouter = createTRPCRouter({
  /**
   * Simple hello greeting.
   *
   * @example
   * const greeting = await trpc.hello.greet.query()
   * // Returns: "Hello world!"
   */
  greet: publicProcedure.query(() => {
    return "Hello kakrey birin!";
  })
});
const globalForPrisma = globalThis;
const createPrismaClient = () => {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });
};
const db = globalForPrisma.prisma ?? createPrismaClient();
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
const todoRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    try {
      return await db.todo.findMany({
        orderBy: { createdAt: "desc" }
      });
    } catch (error) {
      console.error("🔴 [DB Error] in todo.list:", error);
      throw error;
    }
  }),
  create: publicProcedure.input(z.object({ title: z.string().min(1) })).mutation(async ({ input }) => {
    const todo = await db.todo.create({
      data: { title: input.title }
    });
    return todo;
  }),
  toggle: publicProcedure.input(z.object({ id: z.string().uuid(), completed: z.boolean() })).mutation(async ({ input }) => {
    const todo = await db.todo.update({
      where: { id: input.id },
      data: { completed: input.completed }
    });
    return todo;
  }),
  delete: publicProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ input }) => {
    await db.todo.delete({
      where: { id: input.id }
    });
    return { success: true };
  })
});
const appRouter = createTRPCRouter({
  hello: helloRouter,
  todo: todoRouter
});
const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: createTRPCContext
});
const PORT = typeof process.env.PORT !== "undefined" ? parseInt(process.env.PORT, 10) : 3e3;
const HMR_PORT = typeof process.env.HMR_PORT !== "undefined" ? parseInt(process.env.HMR_PORT, 10) : 3001;
const isTest = env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const __filename$1 = url.fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
const createServer = async (root = process.cwd(), isProd = process.env.NODE_ENV === "production") => {
  const app = express();
  app.use("/trpc", trpcMiddleware);
  if (!isProd) {
    const vite = await import("vite");
    const viteServer = await vite.createServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100
        },
        hmr: {
          port: HMR_PORT
        }
      },
      appType: "custom"
    });
    app.use(viteServer.middlewares);
    app.get("*", async (req, res, next) => {
      try {
        let html = fs.readFileSync(path.resolve(root, "index.html"), "utf-8");
        html = await viteServer.transformIndexHtml(req.url, html);
        res.send(html);
      } catch (e) {
        return next(e);
      }
    });
    return { app };
  } else {
    app.use(express.static(path.resolve(__dirname$1, "../client")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname$1, "../client", "index.html"));
    });
  }
  return { app };
};
if (!isTest) {
  createServer().then(
    ({ app }) => app.listen(PORT, () => {
      console.info(`Server available at: http://localhost:${PORT}`);
    })
  );
}
export {
  createServer
};
