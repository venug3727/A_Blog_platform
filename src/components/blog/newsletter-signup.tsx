"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Check, Loader2 } from "lucide-react";
import { useAppStore } from "@/stores";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showSuccess, showError } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual newsletter service
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubscribed(true);
      showSuccess("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error) {
      showError("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">
                You&apos;re all set!
              </h3>
              <p className="text-sm text-green-700">
                Thanks for subscribing. You&apos;ll receive our latest posts in
                your inbox.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Stay Updated</CardTitle>
        <p className="text-muted-foreground">
          Get the latest posts delivered straight to your inbox
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="sm:w-auto w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            No spam, unsubscribe at any time
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
