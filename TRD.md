# 📄 Technical Requirements Document (TRD) — ResumeAI

## 1. Executive Summary & Architecture Overview

ResumeAI is designed as a modular, modern, highly performant, and type-safe Next.js full-stack web application. It integrates robust artificial intelligence, client-side resource compilations, and reliable relational data stores.

### 🏛️ System Topology

```
                  ┌──────────────────────────────────────────────┐
                  │          Next.js App Router Client           │
                  │   ┌──────────────────────────────────────┐   │
                  │   │      Zustand Store (UI State)        │   │
                  │   └──────────────────┬───────────────────┘   │
                  │                      │                       │
                  │   ┌──────────────────▼───────────────────┐   │
                  │   │  @react-pdf/renderer (Vector Comp)   │   │
                  │   └──────────────────┬───────────────────┘   │
                  └──────────────────────┼───────────────────────┘
                                         │ HTTPS / API
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │        Next.js Route Handlers (API)          │
                  │   ┌──────────────────┬───────────────────┐   │
                  │   │  Clerk Auth      │  Upstash Redis    │   │
                  │   │  Validation      │  Rate Limiting    │   │
                  │   └──────────────────┼───────────────────┘   │
                  │                      │                       │
                  │   ┌──────────────────▼───────────────────┐   │
                  │   │    Gemini API (gemini-1.5-flash)     │   │
                  │   └──────────────────┬───────────────────┘   │
                  │                      │                       │
                  │   ┌──────────────────▼───────────────────┐   │
                  │   │     Prisma Client (Driver Adapter)   │   │
                  │   └──────────────────┬───────────────────┘   │
                  └──────────────────────┼───────────────────────┘
                                         │ TCP Pool Connection
                                         ▼
                                 [( Supabase DB )]
```

---

## 2. Technical Stack Specifications

| Core Layer | Technology | Specifications |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.2.6 | React 19, Turbopack, App Router, Hybrid SSR/CSR |
| **Styling Engine** | Tailwind CSS 4 & shadcn/ui | OKLCH modern theme, HSL violet color palette, Glassmorphism CSS |
| **Database ORM** | Prisma Client v7.8.0 | Driver adapter pooling, type-safe generated models |
| **Database Instance**| Supabase PostgreSQL | Serverless connection pooling |
| **Authentication** | Clerk v5+ SSO | Google OAuth, email OTP sessions, middleware authorization |
| **AI LLM Core** | Google Gemini API | `gemini-1.5-flash` model for high token speed |
| **In-Memory Store** | Zustand v5.0.14 | LocalStorage state persistence, devtool middleware |
| **Rate Limiter** | `@upstash/ratelimit` | Upstash Redis sliding window (10 requests per minute) |
| **PDF Core Engine** | `@react-pdf/renderer` v4.5.1 | Client-side 100% offline vector compiles under `200ms` |

---

## 3. Database Schema Blueprint (Prisma 7 Postgres)

The PostgreSQL schema is optimized with relational references, cascading deletes, and database indexes for fast query speeds.

```prisma
model User {
  id        String        @id @default(cuid())
  clerkId   String        @unique
  email     String        @unique
  name      String?
  imageUrl  String?
  resumes   Resume[]
  chats     ChatMessage[]
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model Resume {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String   @default("Untitled Resume")
  data      Json     // contains ResumeFormData structure
  template  String   @default("classic")
  version   Int      @default(1)
  atsScore  Int?     // cached last matching score
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model ChatMessage {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  resumeId  String?  // links chat helper to specific resume context
  role      String   // "user" | "assistant"
  content   String
  language  String?  // en, te, hi, fr, ja
  createdAt DateTime @default(now())

  @@index([userId])
}
```

---

## 4. API Endpoints & Request-Response Specifications

All API Route Handlers reside under `app/api/` and utilize standard input schema verification via `Zod`.

### 1. Generate Summary
* **Endpoint:** `POST /api/ai/generate-summary`
* **Input schema (Zod):**
  ```typescript
  {
    experience: Experience[],
    skills: string[],
    jobTitle?: string
  }
  ```
* **Gemini Prompt Rules:** Formulate a high-impact, professional 3-sentence profile summary optimized for parsing filters and recruiters.
* **Output:** `{ success: true, data: { summary: string } }`

### 2. Improve Bullet (Google XYZ Model)
* **Endpoint:** `POST /api/ai/improve-bullet`
* **Input schema (Zod):**
  ```typescript
  {
    bullet: string,
    jobTitle: string,
    context?: string
  }
  ```
* **Gemini Prompt Rules:** Revise the raw bullet point using Google's recruitment paradigm: *"Accomplished [X] as measured by [Y], by doing [Z]"*. Inject realistic metrics if missing.
* **Output:** `{ success: true, data: { improvedBullet: string } }`

### 3. ATS Compatibility Match
* **Endpoint:** `POST /api/ai/ats-score`
* **Input schema (Zod):**
  ```typescript
  {
    resumeData: ResumeFormData,
    jobDescription: string
  }
  ```
* **Gemini Prompt Rules:** Analyze candidate data against the JD. Output a compatibility score (0-100), extract present keywords, identify missing technical requirements, and compile strategic suggestions.
* **Output Format:** JSON mode mapping:
  ```json
  {
    "score": 84,
    "presentKeywords": ["React", "TypeScript", "Node.js"],
    "missingKeywords": ["AWS", "Docker", "CI/CD"],
    "suggestions": ["Add AWS deployment steps", "Incorporate Docker scaling stats"],
    "verdict": "Strong tech alignment, but lacks cloud architecture visibility."
  }
  ```

### 4. Career Copilot Multilingual Chat
* **Endpoint:** `POST /api/ai/chat`
* **Input schema:**
  ```typescript
  {
    message: string,
    resumeContext: ResumeFormData,
    history: { role: "user" | "model", parts: [{ text: string }] }[]
  }
  ```
* **Gemini Prompt Rules:** Acts as an elite bilingual career advisor. Evaluates history and active resume JSON context. Automatically replies in detected language (English, Telugu, Hindi, French, Japanese).
* **Output:** `{ success: true, data: { reply: string, language: string } }`

---

## 5. UI/UX Performance Optimization Strategy

1. **Reactive Zustand Autosave:**
   * Watches the state store `isDirty` flag.
   * Debounces for `5 seconds` using a quiet browser auto-save hook (`useAutoSave.ts`).
   * Silently invokes `PUT /api/resumes/[id]` to sync modifications to the Supabase database.
2. **Butter-Smooth Canvas Rendering:**
   * Utilizes React's concurrent rendering feature `useDeferredValue` on the `resumeData` binding.
   * The Left-Hand editor updates the Zustand state *instantly* upon typing, ensuring `0ms` input latency.
   * The Right-Hand `LivePreview` canvas delays its DOM rendering updates by `300ms` during active typing, preventing frame drops.
3. **Browser Vector Compiles:**
   * PDF compilation compiles A4 vector documents in the browser using `@react-pdf/renderer` in `<200ms`.
   * This mitigates backend server memory crashes and resolves high network payload penalties.

---

## 6. Security, Rate Limiting & Edge Engineering

1. **Authentication:**
   * Clerk SSO acts as our gateway, verified at the API boundary via standard `auth()` middleware verification.
2. **Upstash Sliding Window Redis Limit:**
   * Prevents LLM service abuse.
   * Rate limits API requests using Redis key tracking (`ai-limit:{userId}`). Limit: `10 requests per minute`.
3. **Hybrid Edge Builds:**
   * Prisma Client 7 is integrated via `@prisma/adapter-pg` driver adapters over TCP sockets, preventing query engine binary loading exceptions inside serverless environments.
