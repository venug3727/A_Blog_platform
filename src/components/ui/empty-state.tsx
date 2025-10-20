import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="space-y-6">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        </div>
        {action && (
          <>
            {action.href ? (
              <Button asChild size="lg" className="mt-6">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button onClick={action.onClick} size="lg" className="mt-6">
                {action.label}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
