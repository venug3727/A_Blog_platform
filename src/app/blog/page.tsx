"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PostList } from "@/components/blog/post-list";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useState } from "react";

export default function BlogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">All Posts</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover all the amazing content from our community of writers.
              Use the search and filters to find exactly what you&apos;re
              looking for.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <PostList
          showSearch={true}
          showCategoryFilter={true}
          viewMode={viewMode}
        />
      </div>
    </MainLayout>
  );
}
