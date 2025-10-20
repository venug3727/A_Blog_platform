"use client";

import { useParams } from "next/navigation";
import { api } from "@/lib/trpc/client";
import { MainLayout } from "@/components/layout/main-layout";
import { PostView } from "@/components/blog/post-view";
import { RelatedPosts } from "@/components/blog/related-posts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const {
    data: post,
    isLoading,
    error,
  } = api.posts.getBySlug.useQuery({
    slug,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          {/* Loading Skeleton */}
          <div className="space-y-8 animate-pulse">
            {/* Back button skeleton */}
            <div className="h-10 w-32 bg-muted rounded" />

            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-muted rounded-full" />
                <div className="h-6 w-24 bg-muted rounded-full" />
              </div>
              <div className="h-12 w-full bg-muted rounded" />
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="flex gap-4">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Back Navigation */}
        <div className="flex items-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Post Content */}
        <PostView
          post={{
            ...post,
            published: post.published ?? false,
            createdAt: post.createdAt ?? new Date(),
            updatedAt: post.updatedAt ?? new Date(),
            readingTime: post.readingTime ?? 0,
            wordCount: post.wordCount ?? 0,
            seoKeywords: post.seoKeywords ?? [],
          }}
        />

        {/* Related Posts */}
        <RelatedPosts
          currentPostId={post.id}
          categories={post.postCategories
            .map((pc) => pc.category)
            .filter((cat): cat is NonNullable<typeof cat> => cat !== null)}
        />
      </div>
    </MainLayout>
  );
}
