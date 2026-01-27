import { Suspense, useEffect } from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { PageLoader } from "@/components/loaders";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NotFound } from "@/components/NotFound";

import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/server/trpc";
import type { QueryClient } from "@tanstack/react-query";

import { siteConfig } from "@/lib/site";

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  pendingComponent: PageLoader,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  useEffect(() => {
    document.title = siteConfig.name;
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-destructive mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
