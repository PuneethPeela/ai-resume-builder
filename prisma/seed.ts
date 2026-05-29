import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Delete existing records to avoid duplicates in development
  await prisma.resume.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create a Demo User in DB
  const demoUser = await prisma.user.create({
    data: {
      clerkId: "demo_clerk_user",
      email: "arjun.sharma@example.com",
      name: "Arjun Sharma",
      imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    },
  });

  console.log(`👤 Demo User created: ${demoUser.name} (${demoUser.id})`);

  // 2. Resume 1: Arjun Sharma (Software Engineer)
  const arjunResumeData = {
    personalInfo: {
      firstName: "Arjun",
      lastName: "Sharma",
      email: "arjun.sharma@example.com",
      phone: "+91 98765 43210",
      location: "Hyderabad, Telangana, India",
      linkedin: "https://linkedin.com/in/arjunsharma",
      github: "https://github.com/arjunsharma",
      portfolio: "https://arjunsharma.dev",
    },
    summary: "Results-driven Software Engineer with 2+ years of experience specializing in building high-performance web applications using React, Next.js, and Node.js. Proven track record of improving data loading speeds by 40% and designing scalable APIs serving 10,000+ daily users. Passionate about AI integration and optimization.",
    experience: [
      {
        id: "exp-1",
        company: "TechNexus Technologies",
        position: "Associate Software Engineer",
        startDate: "Jun 2024",
        endDate: "Present",
        current: true,
        location: "Bengaluru, Karnataka (Remote)",
        bullets: [
          "Spearheaded the migration of a legacy dashboard to Next.js 14, reducing initial bundle sizes by 35% and improving Largest Contentful Paint (LCP) score by 1.2s.",
          "Designed and optimized 15+ REST API endpoints using Node.js and PostgreSQL, improving overall request response speeds by 25% across the core SaaS platform.",
          "Implemented robust end-to-end testing suites using Playwright, increasing code coverage from 45% to 80% and preventing 12+ critical UI bugs from hitting production.",
        ],
      },
      {
        id: "exp-2",
        company: "Innovate Labs",
        position: "Software Developer Intern",
        startDate: "Jan 2024",
        endDate: "May 2024",
        current: false,
        location: "Hyderabad, India",
        bullets: [
          "Developed and styled 8+ high-fidelity responsive user interface components using React and Tailwind CSS, resulting in a 15% increase in user retention.",
          "Collaborated directly with product teams to debug and resolve 40+ legacy state hydration issues, reducing web client crashes by 50%.",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "Jawaharlal Nehru Technological University",
        degree: "Bachelor of Technology",
        field: "Computer Science & Engineering",
        startDate: "Sep 2020",
        endDate: "May 2024",
        gpa: "8.8 / 10.0",
      },
    ],
    skills: [
      "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express",
      "Python", "PostgreSQL", "Prisma ORM", "Tailwind CSS", "Git", "REST APIs"
    ],
    projects: [
      {
        id: "proj-1",
        name: "EcoTrack Dashboard",
        description: "An interactive full-stack analytics platform built with React and Prisma to monitor corporate carbon footprint offsets. Integrated interactive Recharts visualizations.",
        technologies: ["React", "Prisma", "PostgreSQL", "Recharts"],
        liveUrl: "https://ecotrack-demo.vercel.app",
        githubUrl: "https://github.com/arjunsharma/ecotrack",
      },
      {
        id: "proj-2",
        name: "AI Query Agent",
        description: "A lightweight python command line agent built to query large SQL databases using LLMs. Employs prompt engineering and safety filters.",
        technologies: ["Python", "SQLite", "Google Gemini"],
        githubUrl: "https://github.com/arjunsharma/ai-agent",
      },
    ],
    certifications: [
      {
        id: "cert-1",
        name: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services",
        date: "Aug 2024",
        url: "https://aws.credential.com/dev-assoc",
      },
    ],
    sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications"],
  };

  const resume1 = await prisma.resume.create({
    data: {
      userId: demoUser.id,
      title: "Arjun Sharma — Full-Stack Resume",
      template: "classic",
      atsScore: 84,
      data: arjunResumeData as any,
    },
  });

  console.log(`📄 Arjun Sharma Resume created: ${resume1.title} (${resume1.id})`);

  // 3. Resume 2: Priya Patel (Data Analyst)
  const priyaResumeData = {
    personalInfo: {
      firstName: "Priya",
      lastName: "Patel",
      email: "priya.patel@example.com",
      phone: "+91 99887 76655",
      location: "Mumbai, Maharashtra, India",
      linkedin: "https://linkedin.com/in/priyapatel",
      github: "https://github.com/priyapatel",
    },
    summary: "Detail-oriented and analytical Data Analyst with 1 year of experience specializing in quantitative business insights, Python script automation, and interactive Tableau dashboards. Proven ability to translate raw data pipelines into actionable recommendations, increasing sales conversions by 12%.",
    experience: [
      {
        id: "exp-1",
        company: "Apex Analytics Corp",
        position: "Junior Data Analyst",
        startDate: "Jul 2024",
        endDate: "Present",
        current: true,
        location: "Mumbai, India",
        bullets: [
          "Compiled monthly performance reports tracking key business metrics for 4 product lines, presenting results directly to VP of Operations.",
          "Wrote automated Python scripts with Pandas to clean and merge weekly marketing campaign inputs, reducing manual file formatting times by 80%.",
          "Designed 6+ interactive Tableau dashboards tracing user churn profiles, enabling marketing teams to adjust target promotions.",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "University of Mumbai",
        degree: "Bachelor of Science",
        field: "Statistics & Data Science",
        startDate: "Jun 2021",
        endDate: "May 2024",
        gpa: "9.2 / 10.0",
      },
    ],
    skills: [
      "Python", "SQL", "Pandas", "NumPy", "Tableau", "Excel",
      "Data Cleaning", "Quantitative Analysis", "A/B Testing", "Git"
    ],
    projects: [
      {
        id: "proj-1",
        name: "E-Commerce Churn Auditor",
        description: "Applied logistic regression analysis on a public dataset of 5,000 users to audit and identify primary variables influencing product subscription churn.",
        technologies: ["Python", "Pandas", "Scikit-Learn", "Matplotlib"],
        githubUrl: "https://github.com/priyapatel/churn-audit",
      },
    ],
    certifications: [
      {
        id: "cert-1",
        name: "Google Data Analytics Professional Certificate",
        issuer: "Coursera",
        date: "Jun 2024",
      },
    ],
    sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications"],
  };

  const resume2 = await prisma.resume.create({
    data: {
      userId: demoUser.id,
      title: "Priya Patel — Data Analyst Resume",
      template: "minimal",
      atsScore: 78,
      data: priyaResumeData as any,
    },
  });

  console.log(`📄 Priya Patel Resume created: ${resume2.title} (${resume2.id})`);

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
