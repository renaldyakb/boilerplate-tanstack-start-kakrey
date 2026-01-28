/**
 * tRPC Context
 *
 * This module handles the creation of the tRPC context which is available
 * in all procedures. The context is a great place to put things like
 * database connections, authentication info, etc.
 */

import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Creates the context for each tRPC request.
 *
 * @example
 * // In the future, you can add database and auth:
 * export const createTRPCContext = async ({ req, res }: CreateExpressContextOptions) => {
 *   const session = await getSession(req)
 *   return {
 *     req,
 *     res,
 *     db: prisma,
 *     session,
 *   }
 * }
 */
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

/**
 * Creates the context for each tRPC request.
 *
 * @example
 * // In the future, you can add database and auth:
 * export const createTRPCContext = async ({ req, res }: CreateExpressContextOptions) => {
 *   const session = await getSession(req)
 *   return {
 *     req,
 *     res,
 *     db: prisma,
 *     session,
 *   }
 * }
 */
export const createTRPCContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return {
    req,
    res,
    session,
  };
};

/**
 * Type alias for the context returned by createTRPCContext.
 * This is used to type the context in procedures.
 */
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
