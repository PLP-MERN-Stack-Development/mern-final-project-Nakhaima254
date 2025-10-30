import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorFallbackProps {
  error?: Error | null;
  resetError?: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
}

export const ErrorFallback = ({
  error,
  resetError,
  title = "Unable to Load Content",
  description = "We encountered an error while loading this content.",
  actionLabel = "Try Again",
}: ErrorFallbackProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-destructive/10 rounded-full">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && process.env.NODE_ENV === 'development' && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-sm font-medium">What you can try:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Check your internet connection</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Refresh the page</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Contact support if the issue persists</span>
            </li>
          </ul>
        </div>

        {resetError && (
          <Button onClick={resetError} variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
