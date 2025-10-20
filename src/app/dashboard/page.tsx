"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PostList } from "@/components/blog/post-list";
import { PostManagementTable } from "@/components/blog/post-management-table";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { PenTool, FileText, FolderOpen, Grid, List, Eye } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/trpc/client";
import { useUIStore, usePostStore, useCategoryStore } from "@/stores";
import { useStoreSync } from "@/hooks/useStoreSync";

export default function DashboardPage() {
  const { viewMode, setViewMode } = useUIStore();
  const { posts } = usePostStore();
  const { categories } = useCategoryStore();

  // Sync tRPC data with stores
  useStoreSync();

  // Fallback to tRPC data if store is empty
  const { data: fallbackPosts } = api.posts.getAll.useQuery({
    published: undefined, // Show both published and draft posts
  });

  const { data: fallbackCategories } = api.categories.getAll.useQuery();

  const postsData = posts.length > 0 ? posts : fallbackPosts || [];
  const categoriesData =
    categories.length > 0 ? categories : fallbackCategories || [];

  const publishedCount = postsData.filter((post) => post.published).length || 0;
  const draftCount = postsData.filter((post) => !post.published).length || 0;
  const totalPosts = postsData.length || 0;
  const totalCategories = categoriesData.length || 0;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your blog posts and content
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/dashboard/new">
              <PenTool className="mr-2 h-5 w-5" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            description="All your blog posts"
            icon={FileText}
            trend={{
              value: 12,
              label: "from last month",
            }}
          />

          <StatCard
            title="Published"
            value={publishedCount}
            description="Live on your blog"
            icon={Eye}
            trend={{
              value: 8,
              label: "from last month",
            }}
          />

          <StatCard
            title="Drafts"
            value={draftCount}
            description="Work in progress"
            icon={PenTool}
            trend={{
              value: -5,
              label: "from last month",
            }}
          />

          <StatCard
            title="Categories"
            value={totalCategories}
            description="Content topics"
            icon={FolderOpen}
            trend={{
              value: 0,
              label: "from last month",
            }}
          />
        </div>

        {/* Posts Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Posts</h2>
            <div className="flex gap-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/categories">Manage Categories</Link>
              </Button>
            </div>
          </div>

          {viewMode === "cards" ? (
            <PostList
              showStatus={true}
              showSearch={true}
              showCategoryFilter={true}
            />
          ) : (
            <PostManagementTable showBulkActions={true} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
