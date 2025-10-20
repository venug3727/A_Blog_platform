"use client";

import Link from "next/link";
import { api } from "@/lib/trpc/client";
import { MainLayout } from "@/components/layout/main-layout";
import { PostCard } from "@/components/blog/post-card";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
} from "@/components/ui/responsive-container";
import {
  ArrowRight,
  BookOpen,
  Zap,
  Loader2,
  Sparkles,
  PenTool,
} from "lucide-react";

export default function Home() {
  const { data: categories, isLoading: categoriesLoading } =
    api.categories.getAll.useQuery();
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery({
    published: true,
    limit: 6,
  });

  const isLoading = categoriesLoading || postsLoading;
  const totalPosts = posts?.length || 0;
  const totalCategories = categories?.length || 0;

  return (
    <MainLayout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative text-center space-y-8 py-12 lg:py-20 overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

          <ResponsiveContainer size="lg" className="relative">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full text-sm font-medium text-primary border border-primary/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 animate-pulse" />
                AI-Powered Writing Assistant
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Modern Blogging
                  </span>
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                    Platform
                  </span>
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  A powerful, fast, and beautiful blogging platform built with
                  Next.js 15, tRPC, and modern web technologies. Create, share,
                  and discover amazing content with AI assistance.
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {totalPosts || "50+"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Posts Published
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {totalCategories || "10+"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Categories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Readers</div>
                </div>
              </div>
            </div>

            <ResponsiveStack
              direction="responsive"
              gap={4}
              justify="center"
              className="mt-10"
            >
              <Button
                asChild
                size="lg"
                className="text-lg px-10 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/blog">
                  Explore Posts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-10 py-4 border-2 hover:bg-primary/5 transition-all duration-300"
              >
                <Link href="/dashboard/new">
                  <PenTool className="mr-2 h-5 w-5" />
                  Start Writing
                </Link>
              </Button>
            </ResponsiveStack>
          </ResponsiveContainer>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <ResponsiveContainer size="lg">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-muted-foreground text-lg lg:text-xl max-w-3xl mx-auto">
                Built with modern technologies and designed for both writers and
                readers, featuring AI-powered assistance and seamless user
                experience
              </p>
            </div>

            <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap={8}>
              <Card className="group text-center hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/30 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="pb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Zap className="h-10 w-10 text-primary group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl mb-4 group-hover:text-primary transition-colors">
                    Lightning Fast
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Built with Next.js 15 and optimized for speed and
                    performance. Experience instant page loads and smooth
                    interactions with modern web technologies.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group text-center hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/30 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="pb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BookOpen className="h-10 w-10 text-secondary group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl mb-4 group-hover:text-secondary transition-colors">
                    Rich Content
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Markdown support with beautiful typography, responsive
                    design, and powerful editing tools for creating engaging
                    content that looks great on any device.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group text-center hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/30 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="pb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Sparkles className="h-10 w-10 text-purple-600 group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl mb-4 group-hover:text-purple-600 transition-colors">
                    AI-Powered
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Get intelligent writing suggestions, SEO optimization, and
                    content enhancement powered by Google Gemini AI to create
                    better content faster.
                  </CardDescription>
                </CardHeader>
              </Card>
            </ResponsiveGrid>
          </ResponsiveContainer>
        </section>

        {/* Categories Section */}
        {!categoriesLoading && categories && categories.length > 0 && (
          <section className="py-16 lg:py-24 bg-muted/30">
            <ResponsiveContainer size="lg">
              <ResponsiveStack
                direction="responsive"
                justify="between"
                align="start"
                className="mb-12"
              >
                <div className="space-y-3">
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Explore Categories
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Discover content organized by topics you love
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="shrink-0"
                >
                  <Link href="/categories">
                    View All Categories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </ResponsiveStack>

              <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap={6}>
                {categories.slice(0, 6).map((category) => (
                  <Card
                    key={category.id}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
                  >
                    <CardHeader className="pb-6">
                      <ResponsiveStack
                        direction="horizontal"
                        justify="between"
                        align="start"
                      >
                        <CardTitle className="text-lg leading-tight">
                          <Link
                            href={`/categories/${category.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {category.name}
                          </Link>
                        </CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          {category.postCount}
                        </Badge>
                      </ResponsiveStack>
                      {category.description && (
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed mt-3">
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                ))}
              </ResponsiveGrid>
            </ResponsiveContainer>
          </section>
        )}

        {/* Recent Posts Section */}
        <section className="py-16 lg:py-24">
          <ResponsiveContainer size="lg">
            <ResponsiveStack
              direction="responsive"
              justify="between"
              align="start"
              className="mb-12"
            >
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-bold">Latest Posts</h2>
                <p className="text-muted-foreground text-lg">
                  Fresh content from our community of writers
                </p>
              </div>
              <Button asChild variant="outline" size="lg" className="shrink-0">
                <Link href="/blog">
                  View All Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </ResponsiveStack>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">
                    Loading latest posts...
                  </p>
                </div>
              </div>
            ) : posts && posts.length > 0 ? (
              <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap={8}>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      ...post,
                      published: post.published ?? false,
                      createdAt: post.createdAt ?? new Date(),
                      readingTime: post.readingTime ?? 0,
                      wordCount: post.wordCount ?? 0,
                    }}
                  />
                ))}
              </ResponsiveGrid>
            ) : (
              <div className="text-center py-16">
                <div className="space-y-6">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No posts yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Be the first to share your thoughts and create amazing
                      content for the community.
                    </p>
                  </div>
                  <Button asChild size="lg">
                    <Link href="/dashboard/new">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Write the First Post
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </ResponsiveContainer>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <ResponsiveContainer size="md">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Never Miss a Post
                </h2>
                <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Subscribe to our newsletter and get the latest articles,
                  tutorials, and insights delivered straight to your inbox.
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <NewsletterSignup />
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32">
          <ResponsiveContainer size="md">
            <div className="text-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-12 lg:p-16 border border-primary/20">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    Ready to Start Writing?
                  </h2>
                  <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Join our community of writers and share your thoughts with
                    the world. Get AI-powered assistance and create amazing
                    content effortlessly.
                  </p>
                </div>
                <ResponsiveStack
                  direction="responsive"
                  gap={4}
                  justify="center"
                >
                  <Button asChild size="lg" className="text-lg px-8 py-3">
                    <Link href="/dashboard/new">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create Your First Post
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-3"
                  >
                    <Link href="/blog">
                      Explore Content
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </ResponsiveStack>
              </div>
            </div>
          </ResponsiveContainer>
        </section>
      </div>
    </MainLayout>
  );
}
