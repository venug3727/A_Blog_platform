"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/trpc/client";
import { usePostStore, useUIStore, useAppStore } from "@/stores";
import {
  useOptimisticPostUpdate,
  useOptimisticPostDelete,
  useOptimisticBulkOperations,
} from "@/hooks/useOptimisticMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface PostManagementTableProps {
  showBulkActions?: boolean;
}

export function PostManagementTable({
  showBulkActions = true,
}: PostManagementTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(0);

  // Zustand stores
  const {
    selectedPosts,
    togglePostSelection,
    selectAllPosts,
    clearSelection,
    setFilters,
  } = usePostStore();

  const { postsPerPage } = useUIStore();
  const { isLoading, setLoading } = useAppStore();

  // Optimistic mutations
  const updatePostMutation = useOptimisticPostUpdate();
  const deletePostMutation = useOptimisticPostDelete();
  const { bulkUpdateStatus, bulkDelete } = useOptimisticBulkOperations();

  const limit = postsPerPage;

  // Update filters when local state changes
  useEffect(() => {
    setFilters({
      search: search || undefined,
      categoryId: selectedCategory || undefined,
      limit,
      offset: page * limit,
    });
  }, [search, selectedCategory, page, limit, setFilters]);

  // Fetch posts with filters
  const {
    data: posts,
    isLoading: isLoadingPosts,
    error,
  } = api.posts.getAll.useQuery({
    published: undefined, // Show both published and draft posts
    search: search || undefined,
    categoryId: selectedCategory || undefined,
    limit,
    offset: page * limit,
  });

  // Fetch categories for filter
  const { data: categories } = api.categories.getAll.useQuery();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value);
    setPage(0);
  };

  const handleSelectPost = (postId: string) => {
    togglePostSelection(postId);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && posts) {
      selectAllPosts(posts.map((post) => post.id));
    } else {
      clearSelection();
    }
  };

  const handleTogglePublish = async (
    postId: string,
    currentStatus: boolean | null
  ) => {
    setLoading("toggle-publish", true);
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        published: !currentStatus, // null will be treated as false, so !null = true
      });
    } finally {
      setLoading("toggle-publish", false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      setLoading("delete-post", true);
      try {
        await deletePostMutation.mutateAsync({ id: postId });
      } finally {
        setLoading("delete-post", false);
      }
    }
  };

  const handleBulkPublish = async () => {
    if (selectedPosts.length === 0) return;
    setLoading("bulk-publish", true);
    try {
      await bulkUpdateStatus.mutateAsync({
        postIds: selectedPosts,
        published: true,
      });
    } finally {
      setLoading("bulk-publish", false);
    }
  };

  const handleBulkUnpublish = async () => {
    if (selectedPosts.length === 0) return;
    setLoading("bulk-unpublish", true);
    try {
      await bulkUpdateStatus.mutateAsync({
        postIds: selectedPosts,
        published: false,
      });
    } finally {
      setLoading("bulk-unpublish", false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedPosts.length} posts? This action cannot be undone.`
      )
    ) {
      setLoading("bulk-delete", true);
      try {
        await bulkDelete.mutateAsync({ postIds: selectedPosts });
      } finally {
        setLoading("bulk-delete", false);
      }
    }
  };

  const hasNextPage = posts && posts.length === limit;
  const hasPrevPage = page > 0;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading posts: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {categories && (
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

      {/* Bulk Actions */}
      {showBulkActions && selectedPosts.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedPosts.length} post{selectedPosts.length === 1 ? "" : "s"}{" "}
            selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkPublish}
              disabled={isLoading("bulk-publish") || bulkUpdateStatus.isPending}
            >
              <Eye className="mr-2 h-4 w-4" />
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkUnpublish}
              disabled={
                isLoading("bulk-unpublish") || bulkUpdateStatus.isPending
              }
            >
              <EyeOff className="mr-2 h-4 w-4" />
              Unpublish
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isLoading("bulk-delete") || bulkDelete.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoadingPosts && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      )}

      {/* Table */}
      {!isLoadingPosts && posts && (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {showBulkActions && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          posts.length > 0 &&
                          selectedPosts.length === posts.length
                        }
                        onCheckedChange={(checked) =>
                          handleSelectAll(checked === true)
                        }
                      />
                    </TableHead>
                  )}
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={showBulkActions ? 7 : 6}
                      className="text-center py-8"
                    >
                      <div className="text-muted-foreground">
                        {search || selectedCategory
                          ? "No posts found matching your criteria"
                          : "No posts available"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => {
                    const categories = post.postCategories
                      .map((pc) => pc.category)
                      .filter(
                        (cat): cat is NonNullable<typeof cat> => cat !== null
                      );

                    const displayDate = post.publishedAt || post.createdAt;

                    return (
                      <TableRow key={post.id}>
                        {showBulkActions && (
                          <TableCell>
                            <Checkbox
                              checked={selectedPosts.includes(post.id)}
                              onCheckedChange={() => handleSelectPost(post.id)}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="space-y-1">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="font-medium hover:text-primary transition-colors line-clamp-2"
                            >
                              {post.title}
                            </Link>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {post.content.substring(0, 100)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={post.published ? "default" : "secondary"}
                          >
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {categories.slice(0, 2).map((category) => (
                              <Badge
                                key={category.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {category.name}
                              </Badge>
                            ))}
                            {categories.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readingTime} min
                            </div>
                            <div>{post.wordCount} words</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {displayDate
                                ? formatDistanceToNow(displayDate, {
                                    addSuffix: true,
                                  })
                                : "No date"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={
                                  isLoading("toggle-publish") ||
                                  isLoading("delete-post")
                                }
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
                                onClick={() =>
                                  handleTogglePublish(post.id, post.published)
                                }
                                disabled={
                                  isLoading("toggle-publish") ||
                                  updatePostMutation.isPending
                                }
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
                                onClick={() => handleDelete(post.id)}
                                disabled={
                                  isLoading("delete-post") ||
                                  deletePostMutation.isPending
                                }
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {posts.length > 0 && (hasNextPage || hasPrevPage) && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {page * limit + 1} to{" "}
                {Math.min((page + 1) * limit, page * limit + posts.length)} of
                posts
              </div>
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
