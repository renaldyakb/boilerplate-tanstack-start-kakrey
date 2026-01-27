/**
 * Logger Middleware
 *
 * Logs all tRPC procedure calls with their inputs and results.
 * Useful for debugging and monitoring.
 */

import { middleware } from "../init";

/**
 * Middleware that logs procedure calls.
 *
 * @example
 * // Output in console:
 * // [tRPC] posts.list started
 * // [tRPC] posts.list completed in 15ms - success
 */
export const loggerMiddleware = middleware(async ({ path, type, next }) => {
  const start = Date.now();

  console.log(`[tRPC] ${path} ${type} started`);

  const result = await next();

  const durationMs = Date.now() - start;
  const status = result.ok ? "success" : "error";

  console.log(
    `[tRPC] ${path} ${type} completed in ${durationMs}ms - ${status}`,
  );

  return result;
});
