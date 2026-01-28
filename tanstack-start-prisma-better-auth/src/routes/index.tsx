import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trpc, queryClient } from "@/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardSkeleton } from "@/components/loaders";

export const Route = createFileRoute("/")({
  // Prefetch data saat navigasi (render-as-you-fetch pattern)
  loader: async () => {
    await queryClient.ensureQueryData(trpc.hello.greet.queryOptions());
  },
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Suspense fallback={<CardSkeleton />}>
        <HelloCard />
      </Suspense>
    </div>
  );
}

/**
 * Komponen menggunakan useSuspenseQuery.
 * Data dijamin ada (tidak perlu cek isLoading/isError).
 */
import { siteConfig } from "@/lib/site";

// ... existing imports

function HelloCard() {
  // useSuspenseQuery mengembalikan { data, ... }
  const { data: greeting, ...greetQuery } = useSuspenseQuery(
    trpc.hello.greet.queryOptions(),
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          🚀 {siteConfig.name}
        </CardTitle>
        <CardDescription>{siteConfig.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4 text-center">
          {/* Data dijamin ada karena Suspense */}
          <p className="text-lg font-medium">{greeting}</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          disabled
          onClick={() => greetQuery.refetch()}
        >
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
}
