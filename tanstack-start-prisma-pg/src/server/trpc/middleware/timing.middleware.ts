/**
 * Timing Middleware
 *
 * Tracks execution time of procedures and warns about slow queries.
 */

import { middleware } from "../init";

/** Threshold in milliseconds for slow query warning */
const SLOW_QUERY_THRESHOLD_MS = 1000;

/**
 * Middleware that tracks procedure timing.
 * Logs a warning if a procedure takes longer than the threshold.
 */
export const timingMiddleware = middleware(async ({ path, next }) => {
  const start = performance.now();

  const result = await next();

  const durationMs = performance.now() - start;

  if (durationMs > SLOW_QUERY_THRESHOLD_MS) {
    console.warn(
      `[tRPC] ⚠️ Slow query detected: ${path} took ${durationMs.toFixed(2)}ms`,
    );
  }

  return result;
});
