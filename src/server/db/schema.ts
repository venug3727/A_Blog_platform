import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  json,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Posts Table
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  readingTime: integer("reading_time").default(0),
  wordCount: integer("word_count").default(0),
  metaDescription: text("meta_description"),
  seoKeywords: json("seo_keywords").$type<string[]>().default([]),
});

// Categories Table
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Post-Category Junction Table
export const postCategories = pgTable(
  "post_categories",
  {
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "cascade",
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.categoryId] }),
  })
);

// Relations
export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));

// Type exports
export type BlogPost = typeof posts.$inferSelect & {
  postCategories: (typeof postCategories.$inferSelect & {
    category: typeof categories.$inferSelect | null;
  })[];
};

export type Category = typeof categories.$inferSelect & {
  postCount: number;
};

export type PostCategory = typeof postCategories.$inferSelect;

export type InsertPost = typeof posts.$inferInsert;
export type InsertCategory = typeof categories.$inferInsert;
export type InsertPostCategory = typeof postCategories.$inferInsert;
