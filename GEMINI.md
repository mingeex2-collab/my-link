# 🚀 My Link Project Instructions (GEMINI.md)

## 1. Project Overview
- **Project Name:** My Link
- **Goal:** A single-page multi-link profile service for developers and creators.
- **Tech Stack:** Next.js 16 (Turbopack), TypeScript, Tailwind CSS v4, shadcn/ui, Firebase (Auth/Firestore).

## 2. Development Commands
- **Dev Mode:** `npm run dev`
- **Build:** `npm run build`
- **Start:** `npm run start`
- **Format:** `npm run format`
- **Typecheck:** `npm run typecheck`
- **Lint:** `npm run lint`

## 3. Core Directories & Files
- **`app/`**: App Router pages and layouts.
- **`components/ui/`**: shadcn/ui components.
- **`lib/utils.ts`**: Tailwind CSS merge utility (`cn`).
- **`docs/`**: PRD, User Scenarios, Wireframes (`@PRD.md`, `@user_scenario.md`, `@wireframe.md`).
- **`plans/`**: Implementation roadmaps.

## 4. Development Rules
- **Language:** Write in English for token efficiency.
- **File References:** Use the `@` prefix for files or paths (e.g., `@filename`, `@path/filename`).
- **Component Development:**
  - Follow shadcn/ui guidelines; place in `@components/ui/`.
  - Use Tailwind CSS v4 for styling.
- **Validation:** Always run `npm run build` after completing a task to ensure stability.
- **Security:** Never commit or expose `.env` files or secrets.

## 5. Implementation Roadmap
1. **Phase 1 (Setup):** Environment setup and Firebase initialization.
2. **Phase 2 (Auth):** Google Social Login and global auth state.
3. **Phase 3 (Admin):** Link CRUD and Drag & Drop ordering.
4. **Phase 4 (Public):** Dynamic profile pages (`/[username]`).
5. **Phase 5 (Polishing):** UI refinement and final validation.
