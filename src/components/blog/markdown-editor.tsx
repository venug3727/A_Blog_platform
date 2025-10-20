"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistant } from "@/components/blog/ai-assistant";
import {
  KeyboardShortcutsHelp,
  useKeyboardShortcuts,
} from "@/components/blog/keyboard-shortcuts-help";
import {
  Eye,
  Edit,
  Save,
  Clock,
  FileText,
  X,
  Loader2,
  Bold,
  Italic,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  Sparkles,
  Maximize,
  Minimize,
} from "lucide-react";

interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialCategories?: string[];
  initialPublished?: boolean;
  onSave?: (data: {
    title: string;
    content: string;
    categories: string[];
    published: boolean;
  }) => void;
  isLoading?: boolean;
}

// Utility functions
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function countWords(content: string): number {
  return content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function MarkdownEditor({
  initialTitle = "",
  initialContent = "",
  initialCategories = [],
  initialPublished = false,
  onSave,
  isLoading = false,
}: MarkdownEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [published, setPublished] = useState(initialPublished);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "ai">("edit");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const { showHelp, setShowHelp } = useKeyboardShortcuts();

  // Fetch categories for selection
  const { data: categories } = api.categories.getAll.useQuery();

  // Track changes for auto-save
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [title, content, selectedCategories]);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (
      autoSaveEnabled &&
      onSave &&
      hasUnsavedChanges &&
      (title.trim() || content.trim())
    ) {
      onSave({
        title,
        content,
        categories: selectedCategories,
        published: false, // Auto-save always saves as draft
      });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    }
  }, [
    title,
    content,
    selectedCategories,
    autoSaveEnabled,
    onSave,
    hasUnsavedChanges,
  ]);

  // Calculate reading stats
  const readingTime = calculateReadingTime(content);
  const wordCount = countWords(content);

  const handleSave = useCallback(
    (saveAsPublished = false) => {
      if (!onSave) return;

      onSave({
        title,
        content,
        categories: selectedCategories,
        published: saveAsPublished,
      });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    },
    [onSave, title, content, selectedCategories]
  );

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave, autoSaveEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave(false);
      }
      // Ctrl/Cmd + Shift + S to publish
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") {
        e.preventDefault();
        if (title.trim() && content.trim()) {
          handleSave(true);
        }
      }
      // Ctrl/Cmd + P to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setActiveTab(activeTab === "edit" ? "preview" : "edit");
      }
      // Ctrl/Cmd + A to toggle AI assistant
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        setActiveTab(activeTab === "ai" ? "edit" : "ai");
      }
      // F11 to toggle zen mode
      if (e.key === "F11") {
        e.preventDefault();
        setIsZenMode(!isZenMode);
      }
      // Ctrl/Cmd + / to show keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setShowHelp(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, title, content, handleSave, isZenMode, setShowHelp]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Markdown formatting helpers
  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  if (isZenMode) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col">
          {/* Zen Mode Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">{title || "Untitled Post"}</h2>
              <div className="text-sm text-muted-foreground">
                {wordCount} words • {readingTime} min read
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsZenMode(false)}
              >
                <Minimize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Zen Mode Editor */}
          <div className="flex-1 p-8">
            <Textarea
              placeholder="Start writing your post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full border-none resize-none text-lg leading-relaxed focus:ring-0 focus:outline-none bg-transparent"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="Enter your post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            {/* Auto-save toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-save"
                checked={autoSaveEnabled}
                onCheckedChange={(checked) =>
                  setAutoSaveEnabled(checked === true)
                }
              />
              <Label htmlFor="auto-save" className="text-sm">
                Auto-save
              </Label>
            </div>

            {/* Auto-save status indicator */}
            {autoSaveEnabled && (
              <div className="flex items-center gap-2 text-xs">
                {hasUnsavedChanges ? (
                  <>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-amber-600 font-medium">
                      Saving...
                    </span>
                  </>
                ) : lastSaved ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-green-600">
                      Saved {lastSaved.toLocaleTimeString()}
                    </span>
                  </>
                ) : null}
              </div>
            )}

            {/* Word count goal */}
            <div className="text-xs text-muted-foreground">
              Target: 500 words
              {wordCount >= 500 && (
                <span className="text-green-600 ml-1">✓</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats and Categories */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{wordCount} words</span>
            </div>
          </div>

          {/* Category Selection */}
          <div className="flex-1">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="mt-2">
              {categories && categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={
                        selectedCategories.includes(category.id)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      {category.name}
                      {selectedCategories.includes(category.id) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No categories available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "edit" | "preview" | "ai")
        }
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isLoading || !title.trim() || !content.trim()}
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsZenMode(true)}
              title="Zen Mode (F11)"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHelp(true)}
              title="Keyboard Shortcuts (Ctrl+/)"
            >
              ?
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Write your content</CardTitle>

              {/* Markdown Toolbar */}
              <div className="flex flex-wrap gap-1 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("**", "**")}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("*", "*")}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("`", "`")}
                  title="Inline Code"
                >
                  <Code className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("[", "](url)")}
                  title="Link"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("- ", "")}
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("1. ", "")}
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("> ", "")}
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Start writing your post content in Markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm resize-none"
              />
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <p>
                  Supports Markdown formatting. Use **bold**, *italic*, `code`,
                  and more.
                </p>
                <p>
                  <strong>Shortcuts:</strong> Ctrl+S (Save), Ctrl+Shift+S
                  (Publish), Ctrl+P (Toggle Preview), Ctrl+A (AI Assistant),
                  Ctrl+/ (Help)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {content.trim() ? (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold tracking-tight mt-6 mb-4 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold tracking-tight mt-6 mb-3 first:mt-0">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold tracking-tight mt-4 mb-2 first:mt-0">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="leading-7 mb-4">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="my-4 ml-6 list-disc [&>li]:mt-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="my-4 ml-6 list-decimal [&>li]:mt-1">
                          {children}
                        </ol>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="mt-4 border-l-4 border-primary/20 pl-4 italic bg-muted/50 py-2 rounded-r">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        if (isInline) {
                          return (
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                              {children}
                            </code>
                          );
                        }
                        return <code className={className}>{children}</code>;
                      },
                      pre: ({ children }) => (
                        <pre className="mb-4 mt-4 overflow-x-auto rounded-lg border bg-muted p-4">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start writing to see your preview here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <AIAssistant
            title={title}
            content={content}
            onTitleSuggestion={(suggestedTitle) => {
              setTitle(suggestedTitle);
            }}
            onKeywordsGenerated={(keywords) => {
              // Add keywords as a comment in the content for reference
              const keywordComment = `<!-- SEO Keywords: ${keywords.join(
                ", "
              )} -->`;
              if (!content.includes("<!-- SEO Keywords:")) {
                setContent(keywordComment + "\n\n" + content);
              }
            }}
            onMetaDescriptionGenerated={(description) => {
              // Add meta description as a comment in the content for reference
              const metaComment = `<!-- Meta Description: ${description} -->`;
              if (!content.includes("<!-- Meta Description:")) {
                setContent(metaComment + "\n\n" + content);
              }
            }}
            onCategorySuggestion={(suggestedCategories) => {
              const categoryIds = suggestedCategories
                .map((cat) => categories?.find((c) => c.name === cat.name)?.id)
                .filter(Boolean) as string[];

              setSelectedCategories((prev) => {
                const newCategories = [...new Set([...prev, ...categoryIds])];
                return newCategories;
              });
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Publishing Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={(checked) => setPublished(checked === true)}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Draft:</strong> Only you can see this post
            </p>
            <p>
              <strong>Published:</strong> Post will be visible to everyone
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
}
