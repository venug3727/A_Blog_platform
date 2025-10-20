"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/trpc/client";
import { PostCard } from "./post-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, FileText, PenTool } from "lucide-react";
import { PostCardSkeletonGrid } from "@/components/ui/post-card-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface PostListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialPosts?: any[];
  showStatus?: boolean;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  categoryId?: string;
  viewMode?: "grid" | "list";
}

export function PostList({
  initialPosts = [],
  showStatus = false,
  showSearch = true,
  showCategoryFilter = true,
  categoryId,
  viewMode = "grid",
}: PostListProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryId || ""
  );
  const [page, setPage] = useState(0);
  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch posts with filters
  const {
    data: postsData,
    isLoading,
    error,
  } = api.posts.getAll.useQuery({
    published: showStatus ? undefined : true,
    search: debouncedSearch || undefined,
    categoryId: selectedCategory || categoryId || undefined,
    limit,
    offset: page * limit,
  });

  // Fetch categories for filter
  const { data: categories } = api.categories.getAll.useQuery();
  const utils = api.useUtils();

  const posts = postsData || initialPosts;
  const hasNextPage = posts.length === limit;
  const hasPrevPage = page > 0;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0); // Reset to first page when searching
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value);
    setPage(0); // Reset to first page when filtering
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading posts: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      {(showSearch || showCategoryFilter) && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {showCategoryFilter && categories && (
              <Select
                value={selectedCategory || "all"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.postCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading posts...</span>
            </div>
          </div>
          <PostCardSkeletonGrid count={6} />
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && (
        <>
          {posts.length === 0 ? (
            search || selectedCategory ? (
              <EmptyState
                icon={Search}
                title="No posts found"
                description="Try adjusting your search criteria or browse all posts."
                action={{
                  label: "Clear Filters",
                  onClick: () => {
                    setSearch("");
                    setSelectedCategory("");
                    setPage(0);
                  },
                }}
              />
            ) : (
              <EmptyState
                icon={showStatus ? PenTool : FileText}
                title={showStatus ? "No posts yet" : "No posts available"}
                description={
                  showStatus
                    ? "Start writing your first blog post and share your thoughts with the world."
                    : "Check back later for new content from our writers."
                }
                action={
                  showStatus
                    ? {
                        label: "Create Your First Post",
                        href: "/dashboard/new",
                      }
                    : undefined
                }
              />
            )
          ) : (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {search || selectedCategory
                    ? `Found ${posts.length} post${
                        posts.length === 1 ? "" : "s"
                      }`
                    : `Showing ${posts.length} post${
                        posts.length === 1 ? "" : "s"
                      }`}
                </p>
              </div>

              {/* Posts Display */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    : "space-y-4"
                }
              >
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    showStatus={showStatus}
                    showActions={showStatus} // Show actions when showing status (dashboard view)
                    viewMode={viewMode}
                    onPostUpdated={() => {
                      // Properly invalidate cache instead of page reload
                      utils.posts.getAll.invalidate();
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {posts.length > 0 && (hasNextPage || hasPrevPage) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={!hasPrevPage}
                  size="sm"
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page + 1}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={!hasNextPage}
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
