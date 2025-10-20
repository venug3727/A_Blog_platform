import { formatDistanceToNow, format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, User, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SocialShare } from "./social-share";
import { ReadingProgress } from "./reading-progress";
import { TableOfContents } from "./table-of-contents";
import { useEffect, useState } from "react";

interface PostViewProps {
  post: {
    id: string;
    title: string;
    content: string;
    slug: string;
    published: boolean;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    readingTime: number;
    wordCount: number;
    metaDescription?: string | null;
    seoKeywords: string[];
    postCategories: Array<{
      category: {
        id: string;
        name: string;
        slug: string;
        description?: string | null;
      } | null;
    }>;
  };
}

export function PostView({ post }: PostViewProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const categories = post.postCategories
    .map((pc) => pc.category)
    .filter(
      (category): category is NonNullable<typeof category> => category !== null
    );

  const displayDate = post.publishedAt || post.createdAt;
  const wasUpdated = post.updatedAt > post.createdAt;

  useEffect(() => {
    setCurrentUrl(window.location.href);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ReadingProgress />

      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Table of Contents - Desktop */}
        <aside className="hidden xl:block w-64 shrink-0">
          <TableOfContents content={post.content} />
        </aside>

        {/* Main Content */}
        <article className="flex-1 max-w-4xl">
          {/* Header */}
          <header className="mb-8 space-y-6">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="hover:bg-secondary/80"
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Meta Description */}
            {post.metaDescription && (
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {post.metaDescription}
              </p>
            )}

            {/* Post Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {post.published ? "Published" : "Created"}{" "}
                    {formatDistanceToNow(displayDate, { addSuffix: true })}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.wordCount} words</span>
                </div>

                {!post.published && (
                  <Badge variant="outline" className="text-xs">
                    Draft
                  </Badge>
                )}
              </div>
            </div>

            {/* Updated notice */}
            {wasUpdated && (
              <p className="text-xs text-muted-foreground">
                Last updated {format(post.updatedAt, "PPP")}
              </p>
            )}

            {/* Social Share */}
            <div className="flex items-center justify-between">
              <div /> {/* Spacer */}
              <SocialShare
                title={post.title}
                url={currentUrl}
                description={post.metaDescription || undefined}
              />
            </div>
          </header>

          <Separator className="mb-8" />

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none prose-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom styling for markdown elements with better responsive design
                h1: ({ children }) => {
                  const id = String(children)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  return (
                    <h1
                      id={id}
                      className="text-2xl sm:text-3xl font-bold tracking-tight mt-8 mb-4 first:mt-0 scroll-mt-24"
                    >
                      {children}
                    </h1>
                  );
                },
                h2: ({ children }) => {
                  const id = String(children)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  return (
                    <h2
                      id={id}
                      className="text-xl sm:text-2xl font-semibold tracking-tight mt-8 mb-4 first:mt-0 scroll-mt-24"
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const id = String(children)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  return (
                    <h3
                      id={id}
                      className="text-lg sm:text-xl font-semibold tracking-tight mt-6 mb-3 first:mt-0 scroll-mt-24"
                    >
                      {children}
                    </h3>
                  );
                },
                p: ({ children }) => (
                  <p className="leading-7 mb-4 text-base sm:text-lg">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="my-6 ml-6 list-disc [&>li]:mt-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 space-y-1">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mt-6 border-l-4 border-primary/20 pl-6 italic bg-muted/50 py-4 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {children}
                      </code>
                    );
                  }
                  return <code className={className}>{children}</code>;
                },
                pre: ({ children }) => (
                  <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-zinc-950 p-4 dark:bg-zinc-900">
                    {children}
                  </pre>
                ),
                img: ({ src, alt }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={alt}
                    className="rounded-lg border shadow-sm max-w-full h-auto"
                  />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      {children}
                    </table>
                  </div>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* SEO Keywords */}
          {post.seoKeywords.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.seoKeywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs hover:bg-muted"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Back to Top Button */}
          {showBackToTop && (
            <Button
              onClick={scrollToTop}
              size="sm"
              className="fixed bottom-8 right-8 rounded-full shadow-lg z-40"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </article>
      </div>
    </>
  );
}
