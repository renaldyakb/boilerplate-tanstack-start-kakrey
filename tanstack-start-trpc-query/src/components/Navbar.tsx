import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">{siteConfig.name}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              activeProps={{ className: "text-foreground" }}
            >
              Home
            </Link>
            {/* Add more links here from siteConfig.items if available in the future */}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="hidden md:block"
          >
            <Button variant="ghost" size="sm">
              GitHub
            </Button>
          </a>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
