import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/trpc/client";
import { useState } from "react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    slug: string;
    published: boolean;
    publishedAt: Date | null;
    createdAt: Date;
    readingTime: number;
    wordCount: number;
    postCategories: Array<{
      category: {
        id: string;
        name: string;
        slug: string;
      } | null;
    }>;
  };
  showStatus?: boolean;
  showActions?: boolean;
  viewMode?: "grid" | "list";
  onPostUpdated?: () => void;
}

export function PostCard({
  post,
  showStatus = false,
  showActions = false,
  viewMode = "grid",
  onPostUpdated,
}: PostCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();

  // Mutations for post management
  const updatePostMutation = api.posts.update.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
      onPostUpdated?.();
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      setIsLoading(false);
    },
  });

  const deletePostMutation = api.posts.delete.useMutation({
    onSuccess: () => {
      utils.posts.getAll.invalidate();
      onPostUpdated?.();
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      setIsLoading(false);
    },
  });

  const handleTogglePublish = async () => {
    setIsLoading(true);
    await updatePostMutation.mutateAsync({
      id: post.id,
      published: !post.published,
    });
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      await deletePostMutation.mutateAsync({ id: post.id });
    }
  };

  const excerpt =
    post.content.length > 150
      ? post.content.substring(0, 150) + "..."
      : post.content;

  const categories = post.postCategories
    .map((pc) => pc.category)
    .filter(
      (category): category is NonNullable<typeof category> => category !== null
    );

  const displayDate = post.publishedAt || post.createdAt;

  const handlePostClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);

    try {
      await router.push(`/blog/${post.slug}`);
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-semibold line-clamp-2">
                  <button
                    onClick={handlePostClick}
                    className="text-left hover:text-primary transition-colors cursor-pointer"
                    disabled={isNavigating}
                  >
                    {isNavigating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {post.title}
                      </span>
                    ) : (
                      post.title
                    )}
                  </button>
                </h3>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {showStatus && (
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  )}
                  {showActions && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={isLoading}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/edit/${post.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleTogglePublish}
                          disabled={isLoading}
                        >
                          {post.published ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleDelete}
                          disabled={isLoading}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground line-clamp-2">{excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(displayDate, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>

                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {categories.slice(0, 2).map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="text-xs"
                      >
                        <Link
                          href={`/categories/${category.slug}`}
                          className="hover:text-primary"
                        >
                          {category.name}
                        </Link>
                      </Badge>
                    ))}
                    {categories.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{categories.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">
            <button
              onClick={handlePostClick}
              className="text-left hover:text-primary transition-colors cursor-pointer"
              disabled={isNavigating}
            >
              {isNavigating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {post.title}
                </span>
              ) : (
                post.title
              )}
            </button>
          </CardTitle>

          <div className="flex items-center gap-2 flex-shrink-0">
            {showStatus && (
              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>
            )}

            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={isLoading}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/edit/${post.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleTogglePublish}
                    disabled={isLoading}
                  >
                    {post.published ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Publish
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDistanceToNow(displayDate, { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col">
        <p className="text-muted-foreground line-clamp-3 mb-4 flex-grow">
          {excerpt}
        </p>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {categories.map((category) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                <Link
                  href={`/categories/${category.slug}`}
                  className="hover:text-primary"
                >
                  {category.name}
                </Link>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
