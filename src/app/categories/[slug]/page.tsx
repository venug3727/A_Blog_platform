"use client";

import { useParams } from "next/navigation";
import { api } from "@/lib/trpc/client";
import { MainLayout } from "@/components/layout/main-layout";
import { PostList } from "@/components/blog/post-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const {
    data: category,
    isLoading: categoryLoading,
    error: categoryError,
  } = api.categories.getBySlug.useQuery({ slug });

  // Calculate post count from the category data
  const postCount =
    category?.postCategories?.filter((pc) => pc.post !== null).length || 0;

  if (categoryLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading category...</p>
        </div>
      </MainLayout>
    );
  }

  if (categoryError || !category) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
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
            <Link href="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Categories
            </Link>
          </Button>
        </div>

        {/* Category Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">
              {category.name}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {postCount} {postCount === 1 ? "post" : "posts"}
            </Badge>
          </div>
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* Posts in Category */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Posts in {category.name}</h2>
          <PostList
            showSearch={true}
            showCategoryFilter={false}
            categoryId={category.id}
          />
        </div>
      </div>
    </MainLayout>
  );
}
