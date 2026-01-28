/**
 * tRPC Procedures
 *
 * This module exports reusable procedure builders that can be used
 * across all routers. Procedures are the building blocks of tRPC APIs.
 */

import { baseProcedure, TRPCError } from "./init";
import { loggerMiddleware, timingMiddleware } from "./middleware";

/**
 * Public procedure - no authentication required.
 * This is the base procedure for public endpoints.
 *
 * @example
 * // In a router:
 * hello: publicProcedure.query(() => 'Hello world!')
 */
export const publicProcedure = baseProcedure
  .use(loggerMiddleware)
  .use(timingMiddleware);

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
 * Protected procedure
 * Requires the user to be authenticated.
 *
 * @example
 * // In a router:
 * secretData: protectedProcedure.query(({ ctx }) => ctx.session.user)
 */
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

