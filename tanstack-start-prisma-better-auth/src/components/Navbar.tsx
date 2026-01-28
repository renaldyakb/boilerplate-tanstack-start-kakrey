import { Link } from "@tanstack/react-router";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const { data: session } = authClient.useSession();
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
            <Link
              to="/todos"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              activeProps={{ className: "text-foreground" }}
            >
              Todos
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
            
            {!session?.session ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden md:block">
                  {session.user.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    await authClient.signOut();
                    window.location.reload();
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
            <ModeToggle />
          </div>
      </div>
    </header>
  );
}
