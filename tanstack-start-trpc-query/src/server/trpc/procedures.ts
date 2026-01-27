/**
 * tRPC Procedures
 *
 * This module exports reusable procedure builders that can be used
 * across all routers. Procedures are the building blocks of tRPC APIs.
 */

import { baseProcedure } from "./init";
import { loggerMiddleware, timingMiddleware } from "./middleware";

/**
 * Public procedure - no authentication required.
 * This is the base procedure for public endpoints.
 *
 * @example
 * // In a router:
 * hello: publicProcedure.query(() => 'Hello world!')
 */
export const publicProcedure = baseProcedure;

/**
 * Logged procedure - includes logging and timing middleware.
 * Use this when you want to track procedure execution.
 *
 * @example
 * // In a router:
 * posts: loggedProcedure.query(() => db.posts.findMany())
 */
export const loggedProcedure = baseProcedure
  .use(loggerMiddleware)
  .use(timingMiddleware);

/**
 * Protected procedure (placeholder for future auth).
 * Will require authentication once auth is implemented.
 *
 * @example
 * // Future usage:
 * protectedRoute: protectedProcedure.query(({ ctx }) => ctx.session.user)
 */
// export const protectedProcedure = baseProcedure
//   .use(authMiddleware)
//   .use(loggerMiddleware)
