import { Loader2 } from "lucide-react";

/**
 * Full page loading spinner with fade animation.
 * Used as Suspense fallback and router pending component.
 */
export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Inline loading spinner for components.
 */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={`h-4 w-4 animate-spin ${className ?? ""}`} />;
}

/**
 * Card skeleton for loading states.
 */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 animate-pulse">
      <div className="h-4 w-1/2 bg-muted rounded mb-4" />
      <div className="h-3 w-3/4 bg-muted rounded mb-2" />
      <div className="h-3 w-2/3 bg-muted rounded" />
    </div>
  );
}
