"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: KeyboardShortcut[] = [
  // File Operations
  { keys: ["Ctrl", "S"], description: "Save draft", category: "File" },
  {
    keys: ["Ctrl", "Shift", "S"],
    description: "Publish post",
    category: "File",
  },

  // Navigation
  {
    keys: ["Ctrl", "P"],
    description: "Toggle preview",
    category: "Navigation",
  },
  {
    keys: ["Ctrl", "A"],
    description: "Toggle AI assistant",
    category: "Navigation",
  },
  { keys: ["F11"], description: "Toggle zen mode", category: "Navigation" },
  {
    keys: ["Ctrl", "/"],
    description: "Show keyboard shortcuts",
    category: "Navigation",
  },

  // Formatting
  { keys: ["Ctrl", "B"], description: "Bold text", category: "Formatting" },
  { keys: ["Ctrl", "I"], description: "Italic text", category: "Formatting" },
  { keys: ["Ctrl", "K"], description: "Insert link", category: "Formatting" },
  {
    keys: ["Ctrl", "Shift", "C"],
    description: "Inline code",
    category: "Formatting",
  },

  // Lists
  {
    keys: ["Ctrl", "Shift", "8"],
    description: "Bullet list",
    category: "Lists",
  },
  {
    keys: ["Ctrl", "Shift", "7"],
    description: "Numbered list",
    category: "Lists",
  },
  { keys: ["Ctrl", "Shift", "."], description: "Quote", category: "Lists" },
];

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({
  isOpen,
  onClose,
}: KeyboardShortcutsHelpProps) {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogClose onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(
            ([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span
                            key={keyIndex}
                            className="flex items-center gap-1"
                          >
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-900 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 shadow-sm">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to show help
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setShowHelp(true);
      }
      // Escape to close help
      if (e.key === "Escape" && showHelp) {
        setShowHelp(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showHelp]);

  return {
    showHelp,
    setShowHelp,
  };
}
