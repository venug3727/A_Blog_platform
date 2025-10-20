"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { MarkdownEditor } from "@/components/blog/markdown-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/trpc/client";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the post to edit
  const {
    data: post,
    isLoading: isLoadingPost,
    error,
  } = api.posts.getById.useQuery({
    id: params.id,
  });

  const updatePostMutation = api.posts.update.useMutation({
    onSuccess: (updatedPost) => {
      setIsLoading(false);
      router.push(`/blog/${updatedPost.slug}`);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error updating post:", error);
    },
  });

  const handleSave = async (data: {
    title: string;
    content: string;
    categories: string[];
    published: boolean;
  }) => {
    if (!data.title.trim() || !data.content.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      await updatePostMutation.mutateAsync({
        id: params.id,
        title: data.title,
        content: data.content,
        published: data.published,
        categoryIds: data.categories,
      });
    } catch (error) {
      console.error("Failed to update post:", error);
      setIsLoading(false);
    }
  };

  if (isLoadingPost) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">
            {error?.message || "Post not found"}
          </p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
            <p className="text-muted-foreground">
              Update your blog post content and settings
            </p>
          </div>
        </div>

        {/* Editor */}
        <MarkdownEditor
          initialTitle={post.title}
          initialContent={post.content}
          initialCategories={post.postCategories
            .map((pc) => pc.categoryId)
            .filter((id): id is string => id !== null)}
          initialPublished={post.published ?? false}
          onSave={handleSave}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  );
}
