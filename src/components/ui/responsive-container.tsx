import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export function ResponsiveContainer({
  children,
  className,
  size = "lg",
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 6,
}: ResponsiveGridProps) {
  const gridClasses = [
    `grid gap-${gap}`,
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cn(gridClasses, className)}>{children}</div>;
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: "vertical" | "horizontal" | "responsive";
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export function ResponsiveStack({
  children,
  className,
  direction = "vertical",
  gap = 4,
  align = "stretch",
  justify = "start",
}: ResponsiveStackProps) {
  const directionClasses = {
    vertical: "flex flex-col",
    horizontal: "flex flex-row",
    responsive: "flex flex-col sm:flex-row",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  return (
    <div
      className={cn(
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        `gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  );
}
