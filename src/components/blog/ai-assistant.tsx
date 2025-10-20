"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Lightbulb,
  Tag,
  FileText,
} from "lucide-react";

interface AIAssistantProps {
  title: string;
  content: string;
  onTitleSuggestion?: (title: string) => void;
  onKeywordsGenerated?: (keywords: string[]) => void;
  onMetaDescriptionGenerated?: (description: string) => void;
  onCategorySuggestion?: (
    categories: Array<{ name: string; slug: string }>
  ) => void;
}

export function AIAssistant({
  title,
  content,
  onTitleSuggestion,
  onKeywordsGenerated,
  onMetaDescriptionGenerated,
  onCategorySuggestion,
}: AIAssistantProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const titleSuggestions = api.ai.generateTitleSuggestions.useMutation({
    onSuccess: (data) => {
      console.log("Title suggestions generated:", data.suggestions);
      if (data.suggestions.length === 0) {
        console.warn("No title suggestions returned from AI service");
      }
    },
    onError: (error) => {
      console.error("Failed to generate title suggestions:", error.message);
    },
  });

  const keywordGeneration = api.ai.generateSEOKeywords.useMutation({
    onSuccess: (data) => {
      if (onKeywordsGenerated) {
        onKeywordsGenerated(data.keywords);
      }
    },
    onError: (error) => {
      console.error("Failed to generate keywords:", error.message);
    },
  });

  const metaGeneration = api.ai.generateMetaDescription.useMutation({
    onSuccess: (data) => {
      if (onMetaDescriptionGenerated) {
        onMetaDescriptionGenerated(data.metaDescription);
      }
    },
    onError: (error) => {
      console.error("Failed to generate meta description:", error.message);
    },
  });

  const categoryQuery = api.ai.suggestCategories.useQuery(
    { title, content },
    {
      enabled: title.length > 0 && content.length > 50,
      refetchOnWindowFocus: false,
    }
  );

  const contentOptimization = api.ai.optimizeContent.useMutation({
    onError: (error) => {
      console.error("Failed to optimize content:", error.message);
    },
  });

  const handleCopy = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const canGenerateAI = title.length > 0 && content.length > 10;
  const hasAnyError =
    titleSuggestions.isError ||
    keywordGeneration.isError ||
    metaGeneration.isError;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Assistant
            {hasAnyError && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Limited Mode
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Get AI-powered suggestions to improve your blog post
            {hasAnyError && (
              <span className="block text-xs text-yellow-600 mt-1">
                AI service may be temporarily unavailable. Fallback suggestions
                will be provided.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title Suggestions */}
          <div className="space-y-2">
            <Button
              onClick={() => titleSuggestions.mutate({ content })}
              disabled={!canGenerateAI || titleSuggestions.isPending}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {titleSuggestions.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Generate Title Suggestions
            </Button>

            {titleSuggestions.data?.suggestions && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Suggested Titles:</p>
                {titleSuggestions.data.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <span className="text-sm flex-1">{suggestion}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(suggestion, `title-${index}`)}
                      >
                        {copiedItem === `title-${index}` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      {onTitleSuggestion && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTitleSuggestion(suggestion)}
                        >
                          Use
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* SEO Keywords */}
          <div className="space-y-2">
            <Button
              onClick={() => keywordGeneration.mutate({ title, content })}
              disabled={!canGenerateAI || keywordGeneration.isPending}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {keywordGeneration.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Tag className="h-4 w-4 mr-2" />
              )}
              Generate SEO Keywords
            </Button>

            {keywordGeneration.data?.keywords && (
              <div className="space-y-2">
                <p className="text-sm font-medium">SEO Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {keywordGeneration.data.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Meta Description */}
          <div className="space-y-2">
            <Button
              onClick={() => metaGeneration.mutate({ title, content })}
              disabled={!canGenerateAI || metaGeneration.isPending}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {metaGeneration.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Generate Meta Description
            </Button>

            {metaGeneration.data?.metaDescription && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Meta Description:</p>
                <div className="p-2 bg-muted rounded">
                  <p className="text-sm">
                    {metaGeneration.data.metaDescription}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {metaGeneration.data.metaDescription.length}/160
                      characters
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleCopy(metaGeneration.data!.metaDescription, "meta")
                      }
                    >
                      {copiedItem === "meta" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Category Suggestions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm font-medium">Suggested Categories:</span>
            </div>

            {categoryQuery.isLoading && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Analyzing content...
                </span>
              </div>
            )}

            {categoryQuery.data?.suggestions &&
              categoryQuery.data.suggestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {categoryQuery.data.suggestions.map((category, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-primary/10"
                        onClick={() =>
                          onCategorySuggestion &&
                          onCategorySuggestion([category])
                        }
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  {onCategorySuggestion && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onCategorySuggestion(categoryQuery.data!.suggestions)
                      }
                    >
                      Apply All Categories
                    </Button>
                  )}
                </div>
              )}

            {categoryQuery.data?.suggestions &&
              categoryQuery.data.suggestions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No matching categories found
                </p>
              )}
          </div>

          <Separator />

          {/* Content Optimization */}
          <div className="space-y-2">
            <Button
              onClick={() => contentOptimization.mutate({ content })}
              disabled={content.length < 50 || contentOptimization.isPending}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {contentOptimization.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-2" />
              )}
              Analyze Content
            </Button>

            {contentOptimization.data && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Readability Score:
                  </span>
                  <Badge
                    variant={
                      contentOptimization.data.readabilityScore >= 7
                        ? "default"
                        : "secondary"
                    }
                  >
                    {contentOptimization.data.readabilityScore}/10
                  </Badge>
                </div>

                {contentOptimization.data.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Suggestions:</p>
                    <ul className="space-y-1">
                      {contentOptimization.data.suggestions.map(
                        (suggestion, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-xs">•</span>
                            {suggestion}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {contentOptimization.data.improvements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Improvements:</p>
                    <ul className="space-y-1">
                      {contentOptimization.data.improvements.map(
                        (improvement, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-xs">•</span>
                            {improvement}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
