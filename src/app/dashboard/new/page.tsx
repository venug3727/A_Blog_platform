"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { MarkdownEditor } from "@/components/blog/markdown-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/trpc/client";
import { useAppStore } from "@/stores";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAppStore();

  const createPostMutation = api.posts.create.useMutation({
    onSuccess: (post) => {
      setIsLoading(false);
      setError(null);
      showSuccess("Post created successfully!");
      router.push(`/blog/${post.slug}`);
    },
    onError: (error) => {
      setIsLoading(false);
      const errorMessage =
        error.message || "Failed to create post. Please try again.";
      setError(errorMessage);
      showError(errorMessage);
      console.error("Error creating post:", error);
    },
  });

  const handleSave = async (data: {
    title: string;
    content: string;
    categories: string[];
    published: boolean;
  }) => {
    // Validation
    if (!data.title.trim()) {
      const errorMsg = "Title is required";
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    if (!data.content.trim()) {
      const errorMsg = "Content is required";
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    if (data.categories.length === 0) {
      const errorMsg = "Please select at least one category";
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createPostMutation.mutateAsync({
        title: data.title.trim(),
        content: data.content.trim(),
        published: data.published,
        categoryIds: data.categories,
      });
    } catch (error) {
      console.error("Failed to save post:", error);
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Post
            </h1>
            <p className="text-muted-foreground">
              Write and publish your next blog post
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Editor */}
        <MarkdownEditor onSave={handleSave} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
}
