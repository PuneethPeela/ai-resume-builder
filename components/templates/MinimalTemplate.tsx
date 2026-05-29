"use client";

import { ResumeFormData, EMPTY_RESUME } from "@/types/resume";

interface TemplateProps {
  data: ResumeFormData;
}

export function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo = EMPTY_RESUME.personalInfo, summary = "", experience = [], education = [], skills = [], projects = [], certifications = [] } = data || {};
  const fullName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim();

  const formatUrl = (url?: string) => {
    if (!url) return "";
    return url.replace(/^(https?:\/\/)?(www\.)?/, "");
  };

  const sections: Record<string, React.ReactNode> = {
    summary: summary ? (
      <div key="summary" className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 border-t border-zinc-200">
        <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wide">
          About
        </span>
        <div className="md:col-span-3 text-[10px] text-zinc-600 leading-relaxed text-justify">
          {summary}
        </div>
      </div>
    ) : null,

    experience: experience.length > 0 ? (
      <div key="experience" className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 border-t border-zinc-200">
        <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wide">
          Experience
        </span>
        <div className="md:col-span-3 space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[10px] text-zinc-900">
                  {exp.position} <span className="font-normal text-zinc-500">| {exp.company}</span>
                </span>
                <span className="text-[9px] text-zinc-500 whitespace-nowrap">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  {exp.location ? ` • ${exp.location}` : ""}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc pl-3.5 text-[9.5px] text-zinc-600 space-y-0.5 leading-relaxed">
                  {exp.bullets.filter(b => b.trim() !== "").map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    education: education.length > 0 ? (
      <div key="education" className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 border-t border-zinc-200">
        <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wide">
          Education
        </span>
        <div className="md:col-span-3 space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline text-[10px]">
              <div>
                <span className="font-bold text-zinc-900">{edu.degree}</span>
                <span className="text-zinc-600"> — {edu.field}</span>
                <p className="text-[9px] text-zinc-500">{edu.institution}</p>
              </div>
              <span className="text-[9px] text-zinc-500 whitespace-nowrap">
                {edu.startDate} – {edu.endDate}
                {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    skills: skills.length > 0 ? (
      <div key="skills" className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 border-t border-zinc-200">
        <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wide">
          Skills
        </span>
        <div className="md:col-span-3 text-[10px] text-zinc-600 leading-relaxed">
          {skills.join("  •  ")}
        </div>
      </div>
    ) : null,

    projects: projects.length > 0 ? (
      <div key="projects" className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 border-t border-zinc-200">
        <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wide">
          Projects
        </span>
        <div className="md:col-span-3 space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline text-[10px]">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                  {proj.name}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[8px] font-normal text-zinc-500">
                      ({proj.technologies.join(", ")})
                    </span>
                  )}
                </div>
                <div className="flex gap-2 text-[8px] text-zinc-500">
                  {proj.githubUrl && <span>GitHub: {formatUrl(proj.githubUrl)}</span>}
                  {proj.liveUrl && <span>Live: {formatUrl(proj.liveUrl)}</span>}
                </div>
              </div>
              <p className="text-[9.5px] text-zinc-600 leading-relaxed">
                {proj.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    certifications: certifications.length > 0 ? (
      <div key="certifications" className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 border-t border-zinc-200">
        <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wide">
          Credentials
        </span>
        <div className="md:col-span-3 space-y-1.5">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline text-[9.5px] text-zinc-600">
              <span>
                <span className="font-bold text-zinc-805">{cert.name}</span> — {cert.issuer}
              </span>
              <span className="text-[9px] text-zinc-500 whitespace-nowrap ml-2">{cert.date}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null,
  };

  const order = data.sectionOrder || ["summary", "experience", "education", "skills", "projects", "certifications"];

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto bg-white text-zinc-900 shadow-sm min-h-[297mm] leading-normal font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-zinc-900 pb-3">
        <div className="space-y-0.5">
          <h3 className="text-xl font-bold tracking-tight text-zinc-900">
            {fullName || "Your Full Name"}
          </h3>
          <p className="text-[9px] text-zinc-500 font-semibold tracking-wider uppercase">
            {experience[0]?.position || "Professional Title"}
          </p>
        </div>
        
        <div className="text-right text-[8.5px] text-zinc-500 font-medium space-y-0.5 mt-2 sm:mt-0 leading-normal">
          <p>{personalInfo.email && `Email: ${personalInfo.email}`}</p>
          <p>{personalInfo.phone && `Phone: ${personalInfo.phone}`}</p>
          <p>{personalInfo.location && `Location: ${personalInfo.location}`}</p>
          <p>
            {personalInfo.linkedin && `LinkedIn: ${formatUrl(personalInfo.linkedin)}`}
            {personalInfo.github && `  |  GitHub: ${formatUrl(personalInfo.github)}`}
          </p>
        </div>
      </div>

      {/* Ordered Sections */}
      <div className="space-y-4 pt-1">
        {order.map((sec) => sections[sec])}
      </div>
    </div>
  );
}
