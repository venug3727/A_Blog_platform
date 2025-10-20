# **Full-Stack Blogging Platform Assessment** 
## **Project Overview** 
You will be building a "Multi-User Blogging Platform" that allows users to create, edit, and delete blog posts with category management. This application will demonstrate your understanding of full-stack development using Next.js 15, PostgreSQL, Drizzle ORM, tRPC, and other modern web technologies. 

**Timeline**: 7 days from assignment receipt  **Expected Time Investment**: 12-16 hours 
## **Technical Requirements** 
### **Backend Development** 
1. #### **Database Design and Implementation** 
- Set up a PostgreSQL database 
- Implement database schema using Drizzle ORM 
- Create necessary tables for: 
- Blog posts (title, content, slug, published status, timestamps) 
- Categories (name, description, slug) 
- Post-category relationships (many-to-many) 
2. #### **API Development (tRPC with Next.js App Router)** 
- Implement type-safe APIs using tRPC for: 
  - CRUD operations for blog posts 
  - CRUD operations for categories 
  - Assigning categories to posts 
  - Filtering posts by category 
- Implement proper error handling and validation using Zod schemas 
- Use tRPC middleware for request validation 
- Implement slug generation for posts and categories 
- Leverage tRPC's automatic type inference for end-to-end type safety 
### **Frontend Development** 
1. #### **User Interface** 
- Create a responsive blog layout with navigation 
- Implement a content editor for post creation/editing (rich text OR markdown) 
- Design forms for post and category management 
- Create a category management interface 
- Build a blog post listing page with filtering 
- Design individual blog post view pages 
2. #### **State Management and Data Fetching** 
- Implement global state management using Zustand (where appropriate) 
- Use React Query (via tRPC's React Query integration) for API data fetching and caching 
- Handle loading and error states appropriately 
- Implement optimistic updates for better user experience 
- Leverage tRPC's built-in React hooks for seamless data fetching 
## **Feature Priority Guide** 
To help you manage your time effectively over the 7-day period, features are prioritized as follows: 
### 🔴 **Must Have (Core Requirements - Priority 1)**
- Blog post CRUD operations (create, read, update, delete) 
- Category CRUD operations 
- Assign one or more categories to posts 
- Blog listing page showing all posts 
- Individual post view page 
- Category filtering on listing page 
- Basic responsive navigation 
- Clean, professional UI (doesn't need to be fancy, just functional and clean) 
### 🟡 **Should Have (Expected Features - Priority 2)**
- Landing page with at least 3 sections (Header/Hero, Features, Footer) 
- Dashboard page for managing posts 
- Draft vs Published post status 
- Loading and error states 
- Mobile-responsive design 
- Content editor (choose ONE: rich text editor OR markdown support - markdown is faster) 
### 🟢 **Nice to Have (Bonus Features - Priority 3)** 
**Only if you have extra time and core features are polished.** 

- Full 5-section landing page (Header, Hero, Features, CTA, Footer) 
- Search functionality for posts 
- Post statistics (word count, reading time) 
- Dark mode support 
- Advanced rich text editor features 
- Image upload for posts 
- Post preview functionality 
- SEO meta tags 
- Pagination 
## **Technical Stack Requirements** 
- **Next.js 15** with App Router 
- **PostgreSQL** (local or hosted, e.g., Supabase, Neon) 
- **Drizzle ORM** 
- **tRPC** (for type-safe API layer) 
- **Zod** (for schema validation with tRPC) 
- **React Query** (TanStack Query, integrated via tRPC) 
- **Zustand** (for global state where needed) 
- **TypeScript** 
- **Tailwind CSS** (strongly recommended for faster styling) 
- **Content editor**: Choose ONE: 
- Markdown editor (faster: textarea + markdown parser) 
- Rich text editor (e.g., Tiptap, Lexical) 
## **Important Notes** 
- **Authentication system is NOT required** - focus on core blogging features 
- **Focus on code quality over feature quantity** - we value well-architected, type-safe code 
- **Choose markdown over rich text** if you want to save 2-3 hours 
- **Use a component library** (shadcn/ui) if you want to speed up UI development 
- **Prioritize properly** - a polished core feature set beats a rushed complete feature set 
## **Evaluation Criteria** 
We will assess your submission based on: 

1. **Code Organization and Architecture** (20%) 
   1. Clean separation of concerns 
   1. Proper folder structure 
   1. Reusable components 
   1. Well-organized tRPC router structure 
1. **UI/UX - Overall Design** (20%) 
   1. Professional and clean design 
   1. Intuitive navigation 
   1. Responsive layout across devices 
   1. Good user feedback (loading states, error messages) 
1. **TypeScript Implementation** (15%) 
   1. Proper use of TypeScript and type safety 
   1. Effective use of tRPC's automatic type inference 
   1. Minimal use of any types 
   1. Well-defined interfaces and types 
1. **React Best Practices** (15%) 
   1. Implementation of modern React patterns and hooks 
   1. Effective use of tRPC React hooks 
   1. Component composition 
   1. Performance considerations 
1. **Database Design** (10%) 
   1. Database schema design and relationships 
   1. Appropriate use of Drizzle ORM 
   1. Data integrity 
1. **API Design (tRPC)** (10%) 
   1. Well-structured tRPC routers and procedures 
   1. Proper input validation with Zod 
   1. Error handling in tRPC context 
   1. Logical organization of endpoints 
1. **State Management** (5%) 
   1. Efficient use of Zustand for global state 
   1. React Query implementation via tRPC 
   1. Appropriate cache management 
1. **Error Handling** (5%) 
- Input validation with Zod schemas 
- User-friendly error messages 
- Graceful error recovery 
## **What We're NOT Looking For** 
- Pixel-perfect designs (clean and functional is enough) 
- Every single bonus feature implemented 
- Over-engineered solutions 
- Excessive premature optimization 
## **What We ARE Looking For** 
- Clean, readable, maintainable code 
- Proper TypeScript usage with tRPC 
- Working core features that are well-implemented 
- Good understanding of the tech stack 
- Thoughtful architecture decisions 
## **Submission Guidelines** 
**Required:** 

- GitHub repository with clear README documentation 
- Setup instructions with all environment variables documented 
- Brief explanation of your tRPC router structure 
- Live deployment link (Vercel recommended - it's free and fast) 
- Instructions on how to seed the database (if applicable) 

**README should include:** 

- Setup steps (how to run locally) 
- Tech stack used 
- Features implemented (checklist from Priority 1, 2, 3) 
- Any trade-offs or decisions you made 
- Time spent (optional but helpful) 
## **Time Management Suggestions** 
### **Day 1-2: Setup & Backend** 
- Project initialization and dependencies 
- Database setup and Drizzle schema 
- Basic tRPC setup with routers 
- Core CRUD operations for posts and categories 
### **Day 3-4: Core Features** 
- Blog listing page 
- Individual post view 
- Post creation/editing form 
- Category management 
- Category filtering 
### **Day 5-6: Polish & Priority 2 Features** 
- Dashboard implementation 
- Landing page (3 sections minimum) 
- Mobile responsiveness 
- Loading and error states 
- Bug fixes 
### **Day 7: Final Polish & Deployment** 
- Code cleanup 
- README documentation 
- Deployment to Vercel 
- Final testing 
- (Optional) Add bonus features if time permits 
## **Recommended Shortcuts to Save Time** 
1. Use **shadcn/ui** for pre-built components (saves 3-4 hours) 
1. Choose **markdown** over rich text editor (saves 2-3 hours) 
1. Use **Neon or Supabase** for quick PostgreSQL setup (saves 1 hour) 
1. Start with a **simple 3-section landing page**, expand if time allows 
1. Focus on **desktop-first**, then add mobile responsiveness 
1. Use **Tailwind's default theme** instead of custom design system 
## **Questions?** 
If anything is unclear about the requirements, please document your assumptions in your README. We value your ability to make reasonable decisions when faced with ambiguity. ![](Aspose.Words.24d0e5a3-a2dd-4d42-9e26-3bad193e0ece.001.png)

**Remember**: We're evaluating your ability to build production-quality code with modern tools. A well-implemented core feature set with clean architecture is much more valuable than a rushed application with every feature. 
