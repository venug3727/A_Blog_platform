"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { NotificationContainer } from "@/components/ui/notification";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { APP_CONFIG } from "@/lib/config";
import { Menu, X, PenTool, WifiOff } from "lucide-react";
import { useAppStore } from "@/stores";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isOnline, setOnlineStatus } = useAppStore();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial status
    setOnlineStatus(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnlineStatus]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { name: "Home", href: ROUTES.HOME },
    { name: "Blog", href: ROUTES.BLOG },
    { name: "Categories", href: ROUTES.CATEGORIES },
    { name: "Dashboard", href: ROUTES.DASHBOARD },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href={ROUTES.HOME} className="flex items-center space-x-2">
                <PenTool className="h-6 w-6" />
                <span className="font-bold text-lg">{APP_CONFIG.name}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild size="sm">
                <Link href={ROUTES.NEW_POST}>
                  <PenTool className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden border-t bg-background"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-3 py-2">
                  <Button asChild size="sm" className="w-full">
                    <Link
                      href={ROUTES.NEW_POST}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      New Post
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="container mx-auto flex items-center gap-2 text-yellow-800">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">
              You&apos;re currently offline. Some features may not work
              properly.
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <ErrorBoundary>
          <LoadingOverlay>{children}</LoadingOverlay>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link href={ROUTES.HOME} className="flex items-center space-x-2">
                <PenTool className="h-5 w-5" />
                <span className="font-semibold">{APP_CONFIG.name}</span>
              </Link>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                {APP_CONFIG.description}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              {navigation.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Global Notifications */}
      <NotificationContainer />
      <Toaster />
    </div>
  );
}
