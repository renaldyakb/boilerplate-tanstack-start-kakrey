import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="flex h-[calc(100vh-(--spacing(14)))] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="text-muted-foreground max-w-[500px]">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or never existed.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
}
