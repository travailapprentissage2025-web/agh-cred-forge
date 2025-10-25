import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="relative w-full max-w-[800px] px-4">
        {/* Animated background pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-[50%] h-[500px] w-[500px] -translate-x-[50%] -translate-y-[50%] animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
        </div>

        <div className="relative rounded-lg border bg-card p-8 shadow-xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Text Content */}
            <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
              <h1 className="mb-2 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-6xl font-bold text-transparent">
                404
              </h1>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                Page Not Found
              </h2>
              <p className="mb-8 text-muted-foreground">
                Sorry, we couldn't find the page you're looking for. The page might have been removed, 
                renamed, or is temporarily unavailable.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="default" size="lg" asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.history.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </div>

            {/* 404 Illustration */}
            <div className="hidden items-center justify-center md:flex">
              <svg
                className="h-64 w-64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" className="animate-pulse text-muted-foreground" />
                <path
                  d="M8 15h8M9.5 9h.01M14.5 9h.01"
                  className="text-foreground"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
