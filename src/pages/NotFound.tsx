import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-xl text-muted-foreground">
            Sorry, the page you're looking for doesn't exist.
          </p>
        </div>
        <div className="space-y-2">
          <a 
            href="/" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </a>
          <p className="text-sm text-muted-foreground">
            Or use the navigation above to find what you're looking for.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
