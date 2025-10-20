"use client";

import { Loader2 } from "lucide-react";
import { useAppStore } from "@/stores";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  loadingKey?: string;
  className?: string;
  children?: React.ReactNode;
}

export function LoadingOverlay({
  loadingKey,
  className,
  children,
}: LoadingOverlayProps) {
  const { isLoading, globalLoading } = useAppStore();

  const isCurrentlyLoading = loadingKey ? isLoading(loadingKey) : globalLoading;

  if (!isCurrentlyLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}

// Simple loading spinner component
export function LoadingSpinner({
  size = "default",
  className,
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}
