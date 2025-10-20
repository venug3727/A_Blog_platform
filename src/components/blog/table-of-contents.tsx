"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      items.push({ id, text, level });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    );

    // Observe all headings
    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <List className="h-4 w-4" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <nav className="space-y-1">
          {tocItems.map(({ id, text, level }) => (
            <button
              key={id}
              onClick={() => scrollToHeading(id)}
              className={`
                block w-full text-left text-sm transition-colors hover:text-primary
                ${
                  activeId === id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }
                ${
                  level === 1
                    ? "pl-0"
                    : level === 2
                    ? "pl-4"
                    : level === 3
                    ? "pl-8"
                    : "pl-12"
                }
              `}
            >
              {text}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
