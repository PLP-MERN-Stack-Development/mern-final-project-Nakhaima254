import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingFallback = ({ 
  message = "Loading...", 
  fullScreen = false 
}: LoadingFallbackProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return (
    <Card className="shadow-card">
      <CardContent className="p-8">
        {content}
      </CardContent>
    </Card>
  );
};

export const LoadingSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
