"use client";

import { api } from "@/lib/trpc/client";
import { PostCard } from "./post-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface RelatedPostsProps {
  currentPostId: string;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  const { data: relatedPosts, isLoading } = api.posts.getAll.useQuery({
    published: true,
    limit: 6, // Get more posts to have better selection after filtering
  });

  // Filter out current post and limit to 3
  const filteredPosts =
    relatedPosts
      ?.filter((post) => post.id !== currentPostId)
      ?.slice(0, 3)
      ?.map((post) => ({
        ...post,
        published: post.published ?? false,
        createdAt: post.createdAt ?? new Date(),
        readingTime: post.readingTime ?? 0,
        wordCount: post.wordCount ?? 0,
      })) || [];

  if (isLoading || filteredPosts.length === 0) {
    return null;
  }

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Related Posts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showStatus={false}
              showActions={false}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
