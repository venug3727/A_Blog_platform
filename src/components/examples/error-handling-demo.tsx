"use client";

import { useState } from "react";
import { z } from "zod";
import { useSimpleForm } from "@/hooks/useSimpleForm";
import { useErrorHandler } from "@/lib/error-utils";
import { useLoadingState } from "@/hooks/useLoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LoadingSpinner,
  LoadingOverlay,
} from "@/components/ui/loading-overlay";
import { ErrorBoundary, ErrorFallback } from "@/components/ui/error-boundary";
import { PostCardSkeleton, FormSkeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Demo schema
const demoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
});

export function ErrorHandlingDemo() {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [triggerError, setTriggerError] = useState(false);
  const { handleError } = useErrorHandler();
  const { withLoading, isLoading } = useLoadingState();

  // Form with error handling
  const form = useSimpleForm(demoSchema, {
    defaultValues: {
      title: "",
      content: "",
      email: "",
    },
    successMessage: "Form submitted successfully!",
  });

  const onSubmit = async (data: z.infer<typeof demoSchema>) => {
    // Simulate API call with potential error
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (triggerError) {
      throw new Error("Simulated server error");
    }

    console.log("Form submitted:", data);
  };

  const simulateNetworkError = () => {
    handleError(new Error("Network connection failed"), "Network Error");
  };

  const simulateLoadingState = async () => {
    await withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }, "demo-loading");
  };

  if (triggerError) {
    throw new Error("Component error for testing error boundary");
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Error Handling & UX Demo</h1>
        <p className="text-muted-foreground mt-2">
          Demonstrating comprehensive error handling and loading states
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form with Error Handling */}
        <Card>
          <CardHeader>
            <CardTitle>Form with Error Handling</CardTitle>
            <CardDescription>
              Try submitting with invalid data or enable error simulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  form.handleSubmitWithError(onSubmit)
                )}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter content" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" disabled={form.isSubmitting}>
                    {form.isSubmitting && (
                      <LoadingSpinner size="sm" className="mr-2" />
                    )}
                    Submit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setTriggerError(!triggerError)}
                  >
                    {triggerError ? "Disable" : "Enable"} Error
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Loading States Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
            <CardDescription>
              Demonstrate different loading states and skeletons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={simulateLoadingState}
                disabled={isLoading("demo-loading")}
              >
                {isLoading("demo-loading") && (
                  <LoadingSpinner size="sm" className="mr-2" />
                )}
                Simulate Loading
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowSkeleton(!showSkeleton)}
              >
                {showSkeleton ? "Hide" : "Show"} Skeleton
              </Button>
            </div>

            <LoadingOverlay loadingKey="demo-loading">
              {showSkeleton ? (
                <FormSkeleton />
              ) : (
                <div className="space-y-2">
                  <p>Content loaded successfully!</p>
                  <p className="text-sm text-muted-foreground">
                    This content is shown when not in skeleton mode.
                  </p>
                </div>
              )}
            </LoadingOverlay>
          </CardContent>
        </Card>

        {/* Error Simulation */}
        <Card>
          <CardHeader>
            <CardTitle>Error Simulation</CardTitle>
            <CardDescription>
              Test different types of errors and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="destructive" onClick={simulateNetworkError}>
                Network Error
              </Button>

              <Button
                variant="destructive"
                onClick={() => setTriggerError(true)}
              >
                Component Error
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              These buttons will trigger different error scenarios to test the
              error handling system.
            </p>
          </CardContent>
        </Card>

        {/* Skeleton Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Components</CardTitle>
            <CardDescription>
              Examples of different skeleton loading states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostCardSkeleton />
          </CardContent>
        </Card>
      </div>

      {/* Error Boundary Example */}
      <Card>
        <CardHeader>
          <CardTitle>Error Boundary</CardTitle>
          <CardDescription>
            This section is wrapped in an error boundary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorBoundary
            fallback={
              <ErrorFallback
                error={new Error("Example error")}
                resetError={() => console.log("Reset error")}
              />
            }
          >
            <p>This content is protected by an error boundary.</p>
            <Button
              variant="outline"
              onClick={() => {
                throw new Error("Test error boundary");
              }}
            >
              Trigger Error Boundary
            </Button>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
