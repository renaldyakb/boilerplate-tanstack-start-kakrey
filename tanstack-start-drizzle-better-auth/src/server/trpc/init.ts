/**
 * tRPC Initialization
 *
 * This module initializes tRPC with the context type and error formatting.
 * It exports the base `t` instance used to create routers and procedures.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import type { TRPCContext } from "./context";

/**
 * Initialize tRPC with context and configuration.
 *
 * @see https://trpc.io/docs/server/config
 */
const t = initTRPC.context<TRPCContext>().create({
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
        stack:
          process.env.NODE_ENV === "development" && error.cause instanceof Error
            ? error.cause.stack
            : undefined,
      },
    };
  },
});

/**
 * Create a new router.
 *
 * @see https://trpc.io/docs/server/routers
 */
export const createTRPCRouter = t.router;

/**
 * Create a server-side caller for the router.
 * Useful for testing or server-side calls.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Merge multiple routers together.
 *
 * @see https://trpc.io/docs/server/merging-routers
 */
export const mergeRouters = t.mergeRouters;

/**
 * Base procedure builder - used to create other procedures.
 * This should not be used directly in routers.
 */
export const baseProcedure = t.procedure;

/**
 * Middleware helper.
 */
export const middleware = t.middleware;

/**
 * Re-export TRPCError for convenience.
 */
export { TRPCError };
