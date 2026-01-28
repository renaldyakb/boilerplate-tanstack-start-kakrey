import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { queryClient } from "@/lib/query-client";
import { PageLoader } from "@/components/loaders";
import type { AppRouter } from "@/server/trpc";

/**
 * tRPC client proxy with React Query integration.
 *
 * Usage patterns:
 *
 * @example
 * // In a route loader (prefetch on navigation)
 * loader: async ({ context: { trpc, queryClient } }) => {
 *   await queryClient.ensureQueryData(trpc.hello.greet.queryOptions())
 * }
 *
 * @example
 * // In a component (uses cached data or fetches)
 * const query = useQuery(trpc.hello.greet.queryOptions())
 *
 * @example
 * // Mutation with invalidation
 * const mutation = useMutation(trpc.posts.create.mutationOptions({
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['posts'] })
 *   }
 * }))
 */
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      httpBatchLink({
        // Since we are using Vite, the server is running on the same port,
        // this means in dev the url is `http://localhost:3000/trpc`
        // and since it's from the same origin, we don't need to explicitly set the full URL
        url: "/trpc",
      }),
    ],
  }),
  queryClient,
});

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPendingComponent: PageLoader,
    defaultPendingMinMs: 300,
    context: {
      trpc,
      queryClient,
    },
    Wrap: function WrapComponent({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  });

  return router;
}

// Re-export queryClient for use in components
export { queryClient };

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
