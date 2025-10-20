import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIContentSuggestion {
  type: "title" | "meta" | "keywords" | "category";
  suggestions: string[];
  confidence: number;
}

export interface ContentOptimization {
  suggestions: string[];
  improvements: string[];
  readabilityScore: number;
}

export class GeminiAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: import("@google/generative-ai").GenerativeModel | null = null;
  private isAvailable: boolean = false;

  constructor() {
    try {
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === "") {
        console.warn(
          "GOOGLE_GEMINI_API_KEY is not configured. AI features will be disabled."
        );
        this.isAvailable = false;
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      // Use the updated model name - gemini-1.5-flash is the current stable model
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Temporarily disable API calls due to model availability issues
      // This will use the intelligent fallback system instead
      this.isAvailable = false;
      console.log(
        "Gemini AI service initialized with fallback mode (API temporarily disabled)"
      );
    } catch (error) {
      console.error("Failed to initialize Gemini AI service:", error);
      this.isAvailable = false;
    }
  }

  private checkAvailability(): boolean {
    if (!this.isAvailable || !this.model) {
      console.warn(
        "AI service is not available. Please check your API key configuration."
      );
      return false;
    }
    return true;
  }

  async generateTitleSuggestions(content: string): Promise<string[]> {
    if (!this.checkAvailability()) {
      console.warn(
        "AI service not available for title suggestions, using fallback"
      );
      return this.generateFallbackTitles(content);
    }

    try {
      const prompt = `
        Based on the following blog post content, generate 5 compelling and SEO-friendly titles.
        Make them engaging, clear, and under 60 characters each.
        Return only the titles, one per line, without numbering or bullets.
        
        Content: ${content.substring(0, 1000)}...
      `;

      const result = await this.model!.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const titles = text
        .split("\n")
        .filter((line: string) => line.trim().length > 0)
        .slice(0, 5)
        .map((title: string) => title.trim().replace(/^[0-9\.\-\*\s]+/, ""));

      console.log("Generated title suggestions:", titles);
      return titles.length > 0 ? titles : this.generateFallbackTitles(content);
    } catch (error) {
      console.error("Error generating title suggestions:", error);
      return this.generateFallbackTitles(content);
    }
  }

  private generateFallbackTitles(content: string): string[] {
    // Extract key words from content for smarter fallback titles
    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const uniqueWords = [...new Set(words)].slice(0, 3);

    const fallbackTitles = [
      uniqueWords.length > 0
        ? `${
            uniqueWords[0].charAt(0).toUpperCase() + uniqueWords[0].slice(1)
          } Guide`
        : "New Blog Post",
      uniqueWords.length > 1
        ? `Understanding ${
            uniqueWords[1].charAt(0).toUpperCase() + uniqueWords[1].slice(1)
          }`
        : "Interesting Article",
      uniqueWords.length > 2
        ? `${
            uniqueWords[2].charAt(0).toUpperCase() + uniqueWords[2].slice(1)
          } Tips`
        : "Latest Update",
      "Featured Content",
      "Blog Entry",
    ];

    return fallbackTitles;
  }

  async generateSEOKeywords(title: string, content: string): Promise<string[]> {
    if (!this.checkAvailability()) {
      return this.generateFallbackKeywords(title, content);
    }

    try {
      const prompt = `
        Analyze the following blog post and extract 8-10 relevant SEO keywords and phrases.
        Focus on terms that readers would search for to find this content.
        Return only the keywords, separated by commas.
        
        Title: ${title}
        Content: ${content.substring(0, 1500)}...
      `;

      const result = await this.model!.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const keywords = text
        .split(",")
        .map((keyword: string) => keyword.trim())
        .filter((keyword: string) => keyword.length > 0)
        .slice(0, 10);

      return keywords.length > 0
        ? keywords
        : this.generateFallbackKeywords(title, content);
    } catch (error) {
      console.error("Error generating SEO keywords:", error);
      return this.generateFallbackKeywords(title, content);
    }
  }

  private generateFallbackKeywords(title: string, content: string): string[] {
    // Extract meaningful keywords from title and content
    const titleWords = title.toLowerCase().match(/\b\w{3,}\b/g) || [];
    const contentWords = content.toLowerCase().match(/\b\w{4,}\b/g) || [];

    // Combine and deduplicate
    const allWords = [...titleWords, ...contentWords];
    const uniqueWords = [...new Set(allWords)];

    // Filter out common words
    const commonWords = [
      "the",
      "and",
      "for",
      "are",
      "but",
      "not",
      "you",
      "all",
      "can",
      "had",
      "her",
      "was",
      "one",
      "our",
      "out",
      "day",
      "get",
      "has",
      "him",
      "his",
      "how",
      "its",
      "may",
      "new",
      "now",
      "old",
      "see",
      "two",
      "who",
      "boy",
      "did",
      "man",
      "way",
      "she",
      "use",
      "her",
      "many",
      "oil",
      "sit",
      "set",
      "run",
      "eat",
      "far",
      "sea",
      "eye",
      "ask",
      "own",
      "say",
      "too",
      "any",
      "try",
      "us",
      "an",
      "as",
      "at",
      "be",
      "by",
      "do",
      "go",
      "he",
      "if",
      "in",
      "is",
      "it",
      "my",
      "no",
      "of",
      "on",
      "or",
      "so",
      "to",
      "up",
      "we",
    ];

    const meaningfulWords = uniqueWords
      .filter((word) => !commonWords.includes(word) && word.length > 3)
      .slice(0, 8);

    return meaningfulWords.length > 0
      ? meaningfulWords
      : ["blog", "article", "content"];
  }

  async generateMetaDescription(
    title: string,
    content: string
  ): Promise<string> {
    if (!this.checkAvailability()) {
      return this.generateFallbackMetaDescription(title, content);
    }

    try {
      const prompt = `
        Create a compelling meta description for this blog post.
        It should be 150-160 characters, include the main topic, and encourage clicks.
        Make it descriptive but concise.
        
        Title: ${title}
        Content: ${content.substring(0, 1000)}...
        
        Return only the meta description, no additional text.
      `;

      const result = await this.model!.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();

      // Ensure it's within the character limit
      const metaDescription =
        text.length > 160 ? text.substring(0, 157) + "..." : text;
      return (
        metaDescription || this.generateFallbackMetaDescription(title, content)
      );
    } catch (error) {
      console.error("Error generating meta description:", error);
      return this.generateFallbackMetaDescription(title, content);
    }
  }

  private generateFallbackMetaDescription(
    title: string,
    content: string
  ): string {
    // Create a smart fallback meta description
    const cleanContent = content.replace(/[#*`]/g, "").trim();
    const firstSentence = cleanContent.split(".")[0];

    let description =
      firstSentence.length > 20 && firstSentence.length < 140
        ? firstSentence + "."
        : cleanContent.substring(0, 140);

    // Ensure it ends properly
    if (description.length >= 140) {
      const lastSpace = description.lastIndexOf(" ", 140);
      description =
        description.substring(0, lastSpace > 100 ? lastSpace : 140) + "...";
    }

    return (
      description ||
      `Learn more about ${title.toLowerCase()} in this comprehensive guide.`
    );
  }

  async suggestCategories(
    title: string,
    content: string,
    existingCategories: Array<{ name: string; slug: string }>
  ): Promise<string[]> {
    if (!this.checkAvailability()) {
      return [];
    }

    try {
      const categoryNames = existingCategories
        .map((cat) => cat.name)
        .join(", ");

      const prompt = `
        Based on the blog post content, suggest which of these existing categories best fit:
        ${categoryNames}
        
        Title: ${title}
        Content: ${content.substring(0, 1000)}...
        
        Return only the category names that match, separated by commas. Maximum 3 categories.
      `;

      const result = await this.model!.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const suggestions = text
        .split(",")
        .map((cat: string) => cat.trim())
        .filter((cat: string) =>
          existingCategories.some(
            (existing) => existing.name.toLowerCase() === cat.toLowerCase()
          )
        )
        .slice(0, 3);

      return suggestions;
    } catch (error) {
      console.error("Error suggesting categories:", error);
      return [];
    }
  }

  async optimizeContent(content: string): Promise<ContentOptimization> {
    if (!this.checkAvailability()) {
      return {
        suggestions: [],
        improvements: [],
        readabilityScore: 7,
      };
    }

    try {
      const prompt = `
        Analyze this blog post content and provide:
        1. 3 suggestions for improvement
        2. 2 readability improvements
        3. A readability score from 1-10 (10 being most readable)
        
        Format your response as:
        SUGGESTIONS:
        - suggestion 1
        - suggestion 2
        - suggestion 3
        
        IMPROVEMENTS:
        - improvement 1
        - improvement 2
        
        SCORE: X
        
        Content: ${content.substring(0, 2000)}...
      `;

      const result = await this.model!.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const suggestions = this.extractSection(text, "SUGGESTIONS:");
      const improvements = this.extractSection(text, "IMPROVEMENTS:");
      const scoreMatch = text.match(/SCORE:\s*(\d+)/);
      const readabilityScore = scoreMatch ? parseInt(scoreMatch[1]) : 7;

      return {
        suggestions,
        improvements,
        readabilityScore,
      };
    } catch (error) {
      console.error("Error optimizing content:", error);
      return {
        suggestions: [],
        improvements: [],
        readabilityScore: 7,
      };
    }
  }

  private extractSection(text: string, sectionHeader: string): string[] {
    const lines = text.split("\n");
    const startIndex = lines.findIndex((line) => line.includes(sectionHeader));

    if (startIndex === -1) return [];

    const items: string[] = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("-")) {
        items.push(line.substring(1).trim());
      } else if (line.includes(":") || line === "") {
        break;
      }
    }

    return items;
  }
}

// Singleton instance
let geminiService: GeminiAIService | null = null;

export function getGeminiService(): GeminiAIService {
  if (!geminiService) {
    geminiService = new GeminiAIService();
  }
  return geminiService;
}
