# Technical Requirements Document (TRD) — ResumeAI

## 1. System Architecture
ResumeAI is designed as a modular, modern, highly performant Next.js full-stack web application. It integrates robust artificial intelligence, client-side resource compilations, and reliable relational data stores.

**Architecture Topology:**
- **Client (Next.js App Router):** Manages UI state with Zustand, handles localized offline PDF compilation (`@react-pdf/renderer`), and interfaces with Clerk for client-side authentication states.
- **Server (Next.js API Routes):** Handles business logic, RBAC authorization, rate limiting (Upstash Redis), and acts as a secure proxy for AI processing.
- **External Services:** Clerk (Auth), Google Gemini 1.5 Pro (AI LLM), and Supabase PostgreSQL (Database accessed via Prisma).

## 2. Chosen Tech Stack
- **Framework:** Next.js (App Router, Hybrid SSR/CSR)
- **Styling:** Tailwind CSS (with shadcn/ui components)
- **ORM:** Prisma Client (with Driver Adapters for serverless pooling)
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Clerk (SSO, Google OAuth)
- **AI Core:** Google Gemini 1.5 Pro

## 3. API Schemas

### `POST /api/resume/generate`
**Purpose:** Generate or enhance resume content (e.g., bullet points, summaries) using Gemini 1.5 Pro (XYZ formula).
**Request Schema (Zod):**
```json
{
  "promptType": "string (e.g., 'bullet_xyz', 'summary', 'ats_audit')",
  "content": "string (raw bullet or resume data)",
  "context": {
    "jobTitle": "string",
    "targetRole": "string",
    "jobDescription": "string (optional)"
  }
}
```
**Response Schema:**
```json
{
  "success": true,
  "data": {
    "generatedText": "string",
    "score": "number (optional, for ATS audits)"
  },
  "error": "null"
}
```

### `GET /api/resume/export`
**Purpose:** Retrieve the compiled user resume data payload for local PDF generation or external parsing.
**Request Schema:**
- Query Parameter: `?resumeId=<string>`
**Response Schema:**
```json
{
  "success": true,
  "resume": {
    "id": "string",
    "title": "string",
    "data": "object (ResumeFormData structure)",
    "template": "string"
  }
}
```

## 4. RBAC Definitions
Role-Based Access Control (RBAC) ensures security, privacy, and clear operational boundaries across the platform.

- **Admin:** 
  - Full system access.
  - View all users' metrics and system-wide analytics.
  - Manage and publish core resume templates.
  - Assign Sub-Admin roles.
- **Sub-Admin:**
  - View user metrics and analytics.
  - Provide support to users (e.g., reset sessions, view error logs).
  - *Cannot* change core templates or system configuration.
- **User:**
  - Standard candidate access.
  - Create, edit, and manage their own private resumes.
  - Utilize AI enhancement tools (subject to Upstash Redis rate limits).
  - Export personal resumes to PDF via the browser.

## 5. Database Schema Blueprint (Prisma)
The PostgreSQL schema is optimized with relational references, cascading deletes, and database indexes.

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  role      String   @default("USER") // ADMIN, SUB_ADMIN, USER
  resumes   Resume[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Resume {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String   @default("Untitled Resume")
  data      Json     // ResumeFormData structure
  template  String   @default("classic")
  atsScore  Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```
