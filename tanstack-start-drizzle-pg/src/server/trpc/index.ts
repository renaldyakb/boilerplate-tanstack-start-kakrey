/**
 * tRPC Module Exports
 *
 * Main entry point for the tRPC server module.
 * Re-exports everything needed for external use.
 */

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createTRPCContext } from "./context";
import { appRouter } from "./routers";

// Re-export types
export type { TRPCContext } from "./context";
export type { AppRouter } from "./routers";

// Re-export router and context
export { appRouter } from "./routers";
export { createTRPCContext } from "./context";

// Re-export utilities for building routers
export { createTRPCRouter, createCallerFactory, TRPCError } from "./init";
export { publicProcedure, loggedProcedure } from "./procedures";

/**
 * Express middleware for tRPC.
 * Use this in your Express server.
 *
 * @example
 * app.use('/trpc', trpcMiddleware)
 */
export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: createTRPCContext,
});
