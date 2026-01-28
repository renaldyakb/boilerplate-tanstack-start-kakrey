/**
 * React Query Client Configuration
 *
 * This module exports a pre-configured QueryClient with optimal caching settings.
 * The configuration ensures data stays fresh across page refreshes and
 * minimizes unnecessary API calls.
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/important-defaults
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Default stale time for queries (5 minutes).
 * Data will be considered fresh for this duration.
 */
const STALE_TIME = 1000 * 60 * 5;

/**
 * Default garbage collection time (30 minutes).
 * Unused cache will be garbage collected after this duration.
 */
const GC_TIME = 1000 * 60 * 30;

/**
 * Pre-configured QueryClient with optimal caching settings.
 *
 * Key configurations:
 * - staleTime: 5 minutes - Data is considered fresh, no refetch on mount
 * - gcTime: 30 minutes - Cache persists for offline/navigation
 * - refetchOnWindowFocus: false - No refetch when tab regains focus
 * - refetchOnMount: false - No refetch on component mount if data exists
 * - refetchOnReconnect: false - No refetch when network reconnects
 * - retry: 1 - Only retry failed requests once
 *
 * To refetch data, use:
 * - queryClient.invalidateQueries() - Invalidate and refetch
 * - query.refetch() - Manual refetch
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes, no unnecessary refetches
      staleTime: STALE_TIME,

      // Keep unused data in cache for 30 minutes
      gcTime: GC_TIME,

      // Disable automatic refetching behaviors
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,

      // Only retry failed requests once
      retry: 1,

      // Retry delay: exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

/**
 * Invalidate all queries matching a key pattern.
 * Use this after mutations to refresh related data.
 *
 * @example
 * // Invalidate all hello queries
 * invalidateQueries(['hello'])
 *
 * // Invalidate specific query
 * invalidateQueries(['hello', 'greet'])
 */
export function invalidateQueries(queryKey: string[]) {
  return queryClient.invalidateQueries({ queryKey });
}

/**
 * Invalidate all queries in the cache.
 * Use sparingly, prefer targeted invalidation.
 */
export function invalidateAllQueries() {
  return queryClient.invalidateQueries();
}
