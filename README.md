# 🚀 ResumeAI — AI-Powered Resume Builder & Auditor

ResumeAI is a premium, state-of-the-art SaaS workspace engineered to help job applicants craft, optimize, and audit their resumes for modern hiring workflows. It features real-time visual editors, smart Applicant Tracking System (ATS) audits, bullet point enhancement using Google's metrics-driven **XYZ formula**, and an inline multi-lingual AI career copilot.

This project was built as a full-stack internship selection assignment showcasing high-end craftsmanship, performance optimizations, and premium design aesthetics.

> [!IMPORTANT]
> For deep technical and product architecture insights, please check the newly added documents in the project root:
> *   **[Technical Requirements Document (TRD.md)](file:///Users/apple/Documents/CSED/Internship%20selection/Full-stack/AI%20powered%20resume%20builder/ai-resume-builder/TRD.md)** — Comprehensive architecture diagram, Postgres schemas, Prisma 7 database pooling configs, Zod validator specifications, API design, and performance debouncing structures.
> *   **[Market Requirements Document (MRD.md)](file:///Users/apple/Documents/CSED/Internship%20selection/Full-stack/AI%20powered%20resume%20builder/ai-resume-builder/MRD.md)** — Candidate target market segments (Arjun Sharma, Priya Patel), core market gaps, competitive matrix (Novoresume, Overleaf), and strategic AI value metrics.

---

## ✨ Features & Capabilities

### 1. Split-Screen Live Builder (Module 1)
*   **Buttery-Smooth Typing:** Utilizes React 18 `useDeferredValue` to debounce live preview rendering by `300ms`, keeping form inputs exceptionally responsive.
*   **Organized Form Accordions:** Structured with collapsible shadcn accordions (Personal Info, Summary, Experience, Education, Skills, Projects, Credentials).
*   **Interactive Skills Badge Tagging:** Fast tag-style input with suggestions for technical keywords.
*   **Flexible Section Reordering:** Dynamic custom section priority controls.

### 2. Premium Typographic Templates (Module 1)
*   **Classic Serif Layout:** Elegant Georgia/Times-serif structure, perfect for finance, research, and traditional sectors.
*   **Modern Sidebar Layout:** A stylized dark sidebar highlight layout suited for creative, tech, and marketing roles.
*   **Minimalist Sans-serif Layout:** Generous grid-based whitespace and structural dividers optimized for maximum legibility.

### 3. Google's XYZ Bullet Point Enhancer (Module 2)
*   **Formula-Driven Optimizations:** Enhances resume bullet points using the Google recruitment model: *"Accomplished [X] as measured by [Y], by doing [Z]"*.
*   **Inline Action:** A single-click sparkle button next to experience bullets contacts Gemini AI to inject realistic metrics and strong action verbs in real-time.

### 4. ATS Auditor & Job Description Tailoring (Module 3)
*   **Match Scoring:** Paste any target job description to compute a matching grade (0-100%) against your resume.
*   **Keyword Auditing:** Compiles matched keywords vs. critical missing keywords (highlighted red/green).
*   **Strategic Recommendations:** Outlines exact, actionable updates needed to align the resume to the target description.

### 5. Multilingual AI Resume Copilot (Module 3)
*   **Floating Assistant Chat:** Slide-in career copilot widget running in the bottom-right corner.
*   **Multilingual Support:** Naturally detects and replies in English, Telugu, Hindi, French, and Japanese.
*   **Context Injection:** Injects the active resume JSON directly into Gemini's history, allowing the agent to write ready-to-copy updates specific to your background.

### 6. Polish & Performance Optimizations (Module 4 & 5)
*   **Instant Local PDF Compilation:** Renders A4 vector graphics using `@react-pdf/renderer` directly inside the client's browser, completing exports in under `200ms` with zero backend server overhead.
*   **Quiet Auto-Save:** Automatically tracks a Zustand `isDirty` state and silently saves edits to the PostgreSQL database with a `5s` debounce as you pause typing.
*   **Harmonious Violet Glassmorphism:** Implements dark slate themes, OKLCH HSL-tailored colors, animated mesh gradients, and elegant scrollbars.

---

## 🛠️ Architecture & Tech Stack

```mermaid
graph TD
    A[Next.js 14 Client App Router] -->|State Management| B(Zustand Store + Persist)
    A -->|Authentication| C[Clerk OAuth]
    A -->|Local PDF Compilation| D["@react-pdf/renderer"]
    
    A -->|API Requests| E[Next.js Server API Routes]
    E -->|Database Operations| F[Prisma ORM Client]
    E -->|Rate Limiting| G[Upstash Redis Limiter]
    E -->|AI Computations| H[Google Gemini AI 1.5 Flash]
    
    F -->|Data Storage| I[(Supabase PostgreSQL)]
```

*   **Framework:** Next.js 14 (App Router)
*   **Database:** Supabase Serverless PostgreSQL
*   **ORM:** Prisma ORM with automated migrations
*   **Authentication:** Clerk Single-Sign-On (Google OAuth, OTP)
*   **AI Engine:** Google Gemini AI API (`gemini-1.5-flash`)
*   **State Store:** Zustand with developer logging & LocalStorage persistence
*   **Rate Limiter:** Upstash Redis Sliding Window (10 req/min)
*   **Styling:** Tailwind CSS 4 & shadcn/ui components (radix-primitives)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm/yarn installed.

### 2. Environmental Configuration
Create a `.env` file in the root directory by copying the example template:
```bash
cp .env.example .env
```
Fill in the following credentials:
```env
# Clerk Auth Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database Connection (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[password]@db.[id].supabase.co:5432/postgres?pgclient=prisma"
DIRECT_URL="postgresql://postgres:[password]@db.[id].supabase.co:5432/postgres"

# Google Gemini API
GEMINI_API_KEY=AIzaSy...
# Set to 'true' to run fully offline with beautiful pre-cached mock responses
NEXT_PUBLIC_MOCK_AI=false

# Upstash Redis (Optional - for API Rate Limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Push Database Schema
Ensure your Supabase PostgreSQL instance is running, then push the Prisma schema:
```bash
npx prisma db push
```

### 5. Seed Demo Data
Populate the database with realistic Indian candidate resumes (Arjun Sharma - Software Engineer, Priya Patel - Data Analyst):
```bash
npx prisma db seed
```
*(Ensure `"seed": "npx tsx prisma/seed.ts"` is configured in your `package.json` package scripts - which has been pre-configured).*

### 6. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access your workspace console.

---

## 🔍 Validation Plan

### Automated Verification
*   **Form Integrity Tests:** Run Zod schema audits on experience/personal schemas.
*   **Lint Auditing:** Run `npm run lint` to confirm clean typing and code formatting.
*   **Production Compilation:** Compile a production build using `npm run build` to verify Next.js server compatibility.

### Manual Verification
1.  **Auth verification:** Authenticate with Clerk via Google OAuth.
2.  **Builder validation:** Type in the editor and watch the LivePreview update smoothly.
3.  **XYZ check:** Type *"wrote backend code"* under experience and click the sparkle button — verify that it updates to a metric-driven bullet starting with a strong verb.
4.  **ATS Match:** Click "ATS Check", paste a Job Description, and verify keyword badges and score compatibility reports.
5.  **PDF check:** Click "Export PDF" and confirm that the downloaded vector document maps beautifully.

---

### 🎨 Design Credits & Acknowledgments
*   Core Styling: Tailwind CSS & OKLCH color palettes.
*   Typography: Google Fonts Inter (Sans-serif) & Georgia (Serif).
*   Author Credit: Built with 💜 by **Puneeth Peela** for the Full-stack Selection Assignment.
