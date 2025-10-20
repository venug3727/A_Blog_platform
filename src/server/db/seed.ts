import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

import { db } from "./index";
import { categories, posts, postCategories } from "./schema";
import { SQL, Placeholder } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create initial categories
  const categoryData = [
    {
      name: "Technology",
      slug: "technology",
      description: "Latest trends and insights in technology",
    },
    {
      name: "Web Development",
      slug: "web-development",
      description: "Frontend, backend, and full-stack development topics",
    },
    {
      name: "AI & Machine Learning",
      slug: "ai-machine-learning",
      description: "Artificial intelligence and machine learning content",
    },
    {
      name: "Programming",
      slug: "programming",
      description: "Programming languages, best practices, and tutorials",
    },
    {
      name: "Design",
      slug: "design",
      description: "UI/UX design, web design, and creative content",
    },
    {
      name: "Tutorial",
      slug: "tutorial",
      description: "Step-by-step tutorials and guides",
    },
    {
      name: "News",
      slug: "news",
      description: "Latest news and updates in tech",
    },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .onConflictDoNothing()
    .returning();
  console.log(`✅ Created ${insertedCategories.length} categories`);

  // Create sample posts
  const postData = [
    {
      title: "Getting Started with Next.js 15",
      content: `# Getting Started with Next.js 15

Next.js 15 introduces several exciting features that make building React applications even more powerful and efficient. In this comprehensive guide, we'll explore the new App Router, server components, and improved performance optimizations.

## What's New in Next.js 15

The latest version of Next.js brings significant improvements:

- **Enhanced App Router**: Better routing with improved performance
- **Server Components**: Reduced client-side JavaScript bundle
- **Improved TypeScript Support**: Better type inference and error handling
- **Optimized Build Process**: Faster builds and deployments

## Setting Up Your First Project

To get started with Next.js 15, you'll need to have Node.js installed on your system. Then, you can create a new project using the following command:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
\`\`\`

This command will set up a new Next.js project with TypeScript and Tailwind CSS configured out of the box.

## Key Features to Explore

### 1. App Router
The new App Router provides a more intuitive way to handle routing in your application with better performance and developer experience.

### 2. Server Components
Server Components allow you to render components on the server, reducing the amount of JavaScript sent to the client.

### 3. Improved Performance
Next.js 15 includes various performance optimizations that make your applications faster and more efficient.

## Conclusion

Next.js 15 is a significant step forward in React development, offering improved performance, better developer experience, and powerful new features that make building modern web applications easier than ever.`,
      slug: "getting-started-with-nextjs-15",
      published: true,
      publishedAt: new Date(),
      readingTime: 5,
      wordCount: 280,
      metaDescription:
        "Learn how to get started with Next.js 15 and explore its new features including the App Router, Server Components, and performance improvements.",
      seoKeywords: [
        "Next.js",
        "React",
        "Web Development",
        "JavaScript",
        "TypeScript",
      ],
    },
    {
      title: "Building Modern UIs with Tailwind CSS",
      content: `# Building Modern UIs with Tailwind CSS

Tailwind CSS has revolutionized the way we approach styling in modern web development. This utility-first CSS framework provides a comprehensive set of classes that enable rapid UI development without writing custom CSS.

## Why Choose Tailwind CSS?

Tailwind CSS offers several advantages over traditional CSS approaches:

- **Utility-First Approach**: Build complex designs using utility classes
- **Responsive Design**: Built-in responsive design utilities
- **Customization**: Highly customizable design system
- **Performance**: Optimized for production with unused CSS removal

## Getting Started

Installing Tailwind CSS is straightforward. You can add it to your project using npm:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Core Concepts

### Utility Classes
Tailwind provides utility classes for almost every CSS property. Instead of writing custom CSS, you compose designs using these utilities.

### Responsive Design
Tailwind makes responsive design simple with its mobile-first approach and responsive prefixes.

### Component Composition
While Tailwind is utility-first, you can still create reusable components by extracting common patterns.

## Best Practices

1. **Start with Mobile**: Use Tailwind's mobile-first approach
2. **Use Component Libraries**: Combine with libraries like Headless UI
3. **Customize Your Design System**: Configure your tailwind.config.js
4. **Optimize for Production**: Use PurgeCSS to remove unused styles

## Conclusion

Tailwind CSS provides a powerful and flexible approach to styling modern web applications. Its utility-first philosophy enables rapid development while maintaining design consistency.`,
      slug: "building-modern-uis-with-tailwind-css",
      published: true,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      readingTime: 4,
      wordCount: 250,
      metaDescription:
        "Discover how to build modern, responsive UIs using Tailwind CSS utility-first approach and best practices for web development.",
      seoKeywords: [
        "Tailwind CSS",
        "CSS",
        "UI Design",
        "Web Development",
        "Responsive Design",
      ],
    },
    {
      title: "The Future of AI in Web Development",
      content: `# The Future of AI in Web Development

Artificial Intelligence is transforming the landscape of web development, offering new possibilities for creating smarter, more efficient, and user-friendly applications. Let's explore how AI is shaping the future of web development.

## Current AI Applications in Web Development

### Code Generation
AI-powered tools like GitHub Copilot and ChatGPT are helping developers write code faster and more efficiently.

### Design Assistance
AI tools can generate design mockups, suggest color schemes, and even create entire user interfaces based on descriptions.

### Content Creation
AI can help generate content, optimize SEO, and create personalized user experiences.

## Emerging Trends

### 1. Intelligent Code Completion
Advanced AI models are providing more accurate and context-aware code suggestions.

### 2. Automated Testing
AI is being used to generate test cases and identify potential bugs before they reach production.

### 3. Performance Optimization
AI algorithms can analyze application performance and suggest optimizations automatically.

### 4. Personalized User Experiences
Machine learning models enable websites to adapt to individual user preferences and behaviors.

## Challenges and Considerations

While AI offers tremendous opportunities, there are important considerations:

- **Data Privacy**: Ensuring user data is handled responsibly
- **Bias and Fairness**: Addressing potential biases in AI algorithms
- **Human Oversight**: Maintaining human control over AI-generated content
- **Technical Complexity**: Managing the complexity of AI integration

## The Road Ahead

The future of AI in web development looks promising, with continued advancements in:

- Natural language interfaces for web applications
- Automated accessibility improvements
- Intelligent content management systems
- Advanced analytics and insights

## Conclusion

AI is not replacing web developers but rather augmenting their capabilities. By embracing AI tools and techniques, developers can create more sophisticated, efficient, and user-centric web applications.`,
      slug: "future-of-ai-in-web-development",
      published: false, // Draft post
      readingTime: 6,
      wordCount: 320,
      metaDescription:
        "Explore how AI is transforming web development with code generation, design assistance, and personalized user experiences.",
      seoKeywords: [
        "AI",
        "Artificial Intelligence",
        "Web Development",
        "Machine Learning",
        "Future Technology",
      ],
    },
    {
      title: "React Hooks Best Practices",
      content: `# React Hooks Best Practices

React Hooks have revolutionized how we write React components. Here are some essential best practices to follow when using hooks in your applications.

## 1. Use Custom Hooks for Reusable Logic

Custom hooks allow you to extract component logic into reusable functions. This promotes code reuse and makes your components cleaner.

## 2. Follow the Rules of Hooks

- Only call hooks at the top level
- Only call hooks from React functions
- Use ESLint plugin to enforce these rules

## 3. Optimize Performance with useMemo and useCallback

Use these hooks to prevent unnecessary re-renders and expensive calculations.

## 4. Keep State Simple

Avoid complex nested state objects. Use multiple useState calls or useReducer for complex state logic.

## Conclusion

Following these best practices will help you write more maintainable and performant React applications.`,
      slug: "react-hooks-best-practices",
      published: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      readingTime: 4,
      wordCount: 180,
      metaDescription:
        "Learn essential React Hooks best practices for writing clean, maintainable, and performant React applications.",
      seoKeywords: [
        "React",
        "Hooks",
        "Best Practices",
        "JavaScript",
        "Frontend",
      ],
    },
    {
      title: "Introduction to TypeScript",
      content: `# Introduction to TypeScript

TypeScript is a powerful superset of JavaScript that adds static type definitions. It helps catch errors early and makes your code more maintainable.

## Why Use TypeScript?

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Improved Code Documentation**: Types serve as documentation
- **Easier Refactoring**: Confident code changes

## Getting Started

Install TypeScript globally:
\`\`\`bash
npm install -g typescript
\`\`\`

Create a simple TypeScript file:
\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Basic Types

TypeScript provides several basic types:
- string
- number
- boolean
- array
- object

## Conclusion

TypeScript is an excellent choice for large-scale JavaScript applications. Start small and gradually adopt more advanced features.`,
      slug: "introduction-to-typescript",
      published: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      readingTime: 3,
      wordCount: 160,
      metaDescription:
        "Get started with TypeScript and learn why it's essential for modern JavaScript development.",
      seoKeywords: [
        "TypeScript",
        "JavaScript",
        "Programming",
        "Web Development",
        "Types",
      ],
    },
    {
      title: "CSS Grid vs Flexbox: When to Use Which",
      content: `# CSS Grid vs Flexbox: When to Use Which

Both CSS Grid and Flexbox are powerful layout systems, but they serve different purposes. Understanding when to use each will make you a more effective developer.

## CSS Grid

CSS Grid is designed for two-dimensional layouts. Use it when you need to control both rows and columns.

**Best for:**
- Page layouts
- Complex grid systems
- Card layouts
- Dashboard interfaces

## Flexbox

Flexbox is designed for one-dimensional layouts. Use it for arranging items in a single direction.

**Best for:**
- Navigation bars
- Centering content
- Distributing space between items
- Component layouts

## Can You Use Both?

Absolutely! Grid and Flexbox work great together. Use Grid for the overall page layout and Flexbox for component-level layouts.

## Example

\`\`\`css
.page-layout {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## Conclusion

Choose Grid for two-dimensional layouts and Flexbox for one-dimensional layouts. Don't be afraid to use both in the same project!`,
      slug: "css-grid-vs-flexbox",
      published: true,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      readingTime: 5,
      wordCount: 220,
      metaDescription:
        "Learn the differences between CSS Grid and Flexbox and when to use each layout system effectively.",
      seoKeywords: ["CSS", "Grid", "Flexbox", "Layout", "Web Design"],
    },
    {
      title: "Building RESTful APIs with Node.js",
      content: `# Building RESTful APIs with Node.js

REST (Representational State Transfer) is an architectural style for designing networked applications. Learn how to build robust RESTful APIs with Node.js and Express.

## REST Principles

### 1. Stateless
Each request must contain all information needed to process it.

### 2. Resource-Based
URLs represent resources, not actions.

### 3. HTTP Methods
Use appropriate HTTP methods for different operations:
- GET: Retrieve data
- POST: Create new resources
- PUT: Update entire resources
- PATCH: Partial updates
- DELETE: Remove resources

## API Design Best Practices

### URL Structure
\`\`\`
GET    /api/users          # Get all users
GET    /api/users/123      # Get user by ID
POST   /api/users          # Create new user
PUT    /api/users/123      # Update user
DELETE /api/users/123      # Delete user
\`\`\`

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Implementation Example

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

// GET all users
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// POST new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  // Validation and creation logic
  res.status(201).json({ id: 1, name, email });
});
\`\`\`

## Error Handling

Implement consistent error responses:

\`\`\`javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status
    }
  });
});
\`\`\`

## Authentication & Authorization

Secure your APIs with JWT tokens:

\`\`\`javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
\`\`\`

## Documentation

Use tools like Swagger/OpenAPI to document your APIs.

## Conclusion

Well-designed RESTful APIs are the backbone of modern web applications. Follow these principles to create APIs that are intuitive, scalable, and maintainable.`,
      slug: "building-restful-apis-nodejs",
      published: true,
      publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      readingTime: 6,
      wordCount: 320,
      metaDescription:
        "Learn how to build robust RESTful APIs with Node.js and Express following best practices and industry standards.",
      seoKeywords: [
        "REST API",
        "Node.js",
        "Express",
        "Backend",
        "Web Development",
      ],
    },
    {
      title: "Database Design Fundamentals",
      content: `# Database Design Fundamentals

Good database design is crucial for building scalable and maintainable applications. Learn the fundamental principles of relational database design.

## Database Design Process

### 1. Requirements Analysis
Understand what data needs to be stored and how it will be used.

### 2. Conceptual Design
Create an Entity-Relationship (ER) diagram to model the data.

### 3. Logical Design
Convert the ER diagram into a relational schema.

### 4. Physical Design
Optimize for performance and storage.

## Normalization

Normalization eliminates data redundancy and ensures data integrity.

### First Normal Form (1NF)
- Each column contains atomic values
- No repeating groups

### Second Normal Form (2NF)
- Must be in 1NF
- No partial dependencies on composite keys

### Third Normal Form (3NF)
- Must be in 2NF
- No transitive dependencies

## Entity Relationships

### One-to-One (1:1)
Each record in one table relates to exactly one record in another.

### One-to-Many (1:N)
One record can relate to multiple records in another table.

### Many-to-Many (M:N)
Multiple records can relate to multiple records. Requires a junction table.

## Indexing Strategies

### Primary Keys
Unique identifier for each row, automatically indexed.

### Foreign Keys
References to primary keys in other tables.

### Composite Indexes
Indexes on multiple columns for complex queries.

\`\`\`sql
-- Create index for faster queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_date ON orders(created_at, status);
\`\`\`

## Data Types

Choose appropriate data types for efficiency:

\`\`\`sql
-- Good practices
id BIGINT PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
is_active BOOLEAN DEFAULT true,
price DECIMAL(10,2)
\`\`\`

## Constraints

Enforce data integrity with constraints:

\`\`\`sql
-- Check constraints
ALTER TABLE products 
ADD CONSTRAINT check_price 
CHECK (price > 0);

-- Foreign key constraints
ALTER TABLE orders 
ADD CONSTRAINT fk_user_id 
FOREIGN KEY (user_id) REFERENCES users(id);
\`\`\`

## Performance Considerations

1. **Avoid Over-Normalization**: Sometimes denormalization improves performance
2. **Use Appropriate Indexes**: But don't over-index
3. **Partition Large Tables**: For better query performance
4. **Regular Maintenance**: Update statistics and rebuild indexes

## Common Pitfalls

- Storing calculated values
- Using generic column names
- Ignoring data types
- Poor naming conventions
- Missing foreign key constraints

## Conclusion

Good database design is an investment in your application's future. Take time to plan your schema carefully, and your application will be more reliable and performant.`,
      slug: "database-design-fundamentals",
      published: true,
      publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      readingTime: 7,
      wordCount: 380,
      metaDescription:
        "Master database design fundamentals including normalization, relationships, indexing, and performance optimization.",
      seoKeywords: [
        "Database Design",
        "SQL",
        "Normalization",
        "Database",
        "Data Modeling",
      ],
    },
    {
      title: "Frontend Testing Strategies",
      content: `# Frontend Testing Strategies

Testing is essential for building reliable frontend applications. Learn different testing strategies and tools to ensure your code works as expected.

## Types of Frontend Tests

### Unit Tests
Test individual components or functions in isolation.

\`\`\`javascript
// Example with Jest and React Testing Library
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
});
\`\`\`

### Integration Tests
Test how multiple components work together.

### End-to-End (E2E) Tests
Test complete user workflows in a real browser environment.

## Testing Tools

### Jest
Popular JavaScript testing framework with built-in assertions and mocking.

### React Testing Library
Testing utilities focused on testing components as users would interact with them.

### Cypress
Modern E2E testing framework with excellent developer experience.

### Playwright
Cross-browser testing tool that supports multiple browsers.

## Testing Best Practices

### 1. Test Behavior, Not Implementation
Focus on what the component does, not how it does it.

\`\`\`javascript
// Good - tests behavior
test('shows error message when form is invalid', () => {
  render(<LoginForm />);
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});

// Bad - tests implementation
test('calls validateEmail function', () => {
  const validateEmailSpy = jest.spyOn(utils, 'validateEmail');
  render(<LoginForm />);
  // This tests implementation details
});
\`\`\`

### 2. Use Descriptive Test Names
Test names should clearly describe what is being tested.

### 3. Arrange, Act, Assert (AAA) Pattern
Structure your tests clearly:

\`\`\`javascript
test('calculates total price correctly', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(30);
});
\`\`\`

## Mocking Strategies

### API Calls
Mock external dependencies to make tests reliable and fast.

\`\`\`javascript
// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test' }),
  })
);
\`\`\`

### Component Dependencies
Mock child components to isolate the component under test.

## Accessibility Testing

Include accessibility in your testing strategy:

\`\`\`javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
\`\`\`

## Visual Regression Testing

Use tools like Chromatic or Percy to catch visual changes:

\`\`\`javascript
// Storybook story for visual testing
export const Default = () => <Button>Click me</Button>;
export const Disabled = () => <Button disabled>Disabled</Button>;
\`\`\`

## Test Coverage

Aim for meaningful coverage, not just high percentages:

\`\`\`bash
# Generate coverage report
npm test -- --coverage
\`\`\`

## Continuous Integration

Integrate tests into your CI/CD pipeline:

\`\`\`yaml
# GitHub Actions example
- name: Run tests
  run: npm test -- --coverage --watchAll=false
\`\`\`

## Conclusion

A comprehensive testing strategy gives you confidence to refactor and add features. Start with unit tests, add integration tests for critical paths, and use E2E tests for key user journeys.`,
      slug: "frontend-testing-strategies",
      published: true,
      publishedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      readingTime: 8,
      wordCount: 420,
      metaDescription:
        "Learn comprehensive frontend testing strategies including unit tests, integration tests, E2E testing, and best practices.",
      seoKeywords: [
        "Frontend Testing",
        "Jest",
        "React Testing Library",
        "Cypress",
        "Testing",
      ],
    },
  ];

  const insertedPosts = await db
    .insert(posts)
    .values(postData)
    .onConflictDoNothing()
    .returning();
  console.log(`✅ Created ${insertedPosts.length} posts`);

  // Get existing categories to create relationships
  const existingCategories = await db.select().from(categories);
  const existingPosts = await db.select().from(posts);

  // Create post-category relationships if we have data
  if (existingCategories.length > 0 && existingPosts.length > 0) {
    const postCategoryData: {
      postId?:
        | string
        | SQL<unknown>
        | Placeholder<string, unknown>
        | null
        | undefined;
      categoryId?:
        | string
        | SQL<unknown>
        | Placeholder<string, unknown>
        | null
        | undefined;
    }[] = [];

    // Add relationships for existing posts
    existingPosts.forEach((post, index) => {
      const categoryIndex = index % existingCategories.length;
      postCategoryData.push({
        postId: post.id,
        categoryId: existingCategories[categoryIndex].id,
      });

      // Add a second category for some variety
      if (existingCategories.length > 1) {
        const secondCategoryIndex = (index + 1) % existingCategories.length;
        postCategoryData.push({
          postId: post.id,
          categoryId: existingCategories[secondCategoryIndex].id,
        });
      }
    });

    if (postCategoryData.length > 0) {
      await db
        .insert(postCategories)
        .values(postCategoryData)
        .onConflictDoNothing();
      console.log(
        `✅ Created ${postCategoryData.length} post-category relationships`
      );
    }
  }

  console.log("🎉 Database seeded successfully!");
}

// Run seed function if called directly
if (require.main === module) {
  seed().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
}

export { seed };
