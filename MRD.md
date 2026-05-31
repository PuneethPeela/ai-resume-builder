# Market Requirements Document (MRD) — ResumeAI

## 1. Executive Summary & Product-Market Fit
In the modern job market, landing a technical interview requires clearing two distinct gatekeepers: Applicant Tracking System (ATS) parsers and human recruiters. Over 90% of large corporations utilize ATS software to filter candidate volumes, rejecting up to 75% of resumes before a human recruiter reviews them.

Most existing resume builders are overly generic, slow to render, charge heavy monthly fees for PDF downloads, or lack actionable technical optimization features. 

**Product-Market Fit:** ResumeAI solves the blank-page syndrome for resume creation, optimizing for ATS, and leveraging AI to tailor resumes to specific job descriptions. It provides a premium, fully optimized, AI-assisted SaaS workspace designed to help developers and tech professionals craft resumes that clear ATS parsers and command recruiters' attention.

## 2. Target Audience & Personas
- **Students & Graduates (e.g., Arjun, Tech Graduate):** Applying to massive campus and off-campus tech pools. Need an AI companion to instantly write summary profiles, refine bullet points using strong verbs, and optimize for technical keyword requirements.
- **Career Switchers (e.g., Priya, Data Analyst to Data Engineer):** Looking to align prior experience with new domain keywords. Need an ATS Audit tool to compare their resume against active job descriptions in real-time, pointing out exact missing keywords.
- **Global Freelancers & Job Seekers:** Need to localize resumes for international remote roles, requiring multi-lingual communication (English, Telugu, Hindi, French, Japanese) and culturally aware formatting.

## 3. Feature Priorities (Internship Application)
To deliver maximum value efficiently, the following features are prioritized for the initial release:

1. **User Authentication (Clerk)**: Secure user onboarding, login, and session management using Clerk SSO (Google OAuth, OTP).
2. **Resume Data Input**: Comprehensive, accordion-style forms for Education, Experience, Skills, Projects, and Credentials with debounced autosave.
3. **AI Generation/Enhancement (Gemini 1.5 Pro)**: Core AI integration to rewrite bullets using the Google XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]") and tailor content to specific job descriptions.
4. **Resume Preview & Export**: Split-screen live builder with 0ms input latency (using `useDeferredValue`), and instant browser-side PDF generation using `@react-pdf/renderer`.
5. **Admin Dashboard**: Usage analytics, user management, and template management for platform administrators.

## 4. Competitive Advantage
Unlike Overleaf (slow compilation, high barrier to entry) or Novoresume (paywalled PDFs, rigid text blocks), ResumeAI is positioned as an Elite Technical Resume Workspace. It offers metric-driven copywriting assistance and 100% free, localized, in-browser vector PDF compilation under 200ms.
