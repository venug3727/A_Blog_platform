"use client";

import Link from "next/link";
import { api } from "@/lib/trpc/client";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FolderOpen } from "lucide-react";

export default function CategoriesPage() {
  const {
    data: categories,
    isLoading,
    error,
  } = api.categories.getAll.useQuery();

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore content organized by topics. Find posts that match your
            interests and discover new areas to explore.
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">
              Error loading categories: {error.message}
            </p>
          </div>
        )}

        {!isLoading && !error && categories && (
          <>
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  No Categories Yet
                </h2>
                <p className="text-muted-foreground">
                  Categories will appear here once posts are created and
                  organized.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">
                          <Link
                            href={`/categories/${category.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {category.name}
                          </Link>
                        </CardTitle>
                        <Badge variant="secondary">
                          {category.postCount}{" "}
                          {category.postCount === 1 ? "post" : "posts"}
                        </Badge>
                      </div>
                      {category.description && (
                        <CardDescription className="text-base">
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View all posts in {category.name} →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
