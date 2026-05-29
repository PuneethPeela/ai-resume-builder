"use client";

import { ResumeFormData, EMPTY_RESUME } from "@/types/resume";
import { Mail, Phone, MapPin, Link2, Github, Globe } from "lucide-react";

interface TemplateProps {
  data: ResumeFormData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo = EMPTY_RESUME.personalInfo, summary = "", experience = [], education = [], skills = [], projects = [], certifications = [] } = data || {};
  const fullName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim();

  const formatUrl = (url?: string) => {
    if (!url) return "";
    return url.replace(/^(https?:\/\/)?(www\.)?/, "");
  };

  const sectionsRight: Record<string, React.ReactNode> = {
    summary: summary ? (
      <div key="summary" className="space-y-1.5 pb-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-violet-700 border-b border-zinc-200 pb-0.5 font-sans">
          Profile Summary
        </h4>
        <p className="text-[9.5px] text-zinc-700 leading-relaxed text-justify font-sans">
          {summary}
        </p>
      </div>
    ) : null,

    experience: experience.length > 0 ? (
      <div key="experience" className="space-y-2 pb-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-violet-700 border-b border-zinc-200 pb-0.5 font-sans">
          Professional Experience
        </h4>
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline text-[10px]">
                <span className="font-bold text-zinc-900 font-sans">
                  {exp.position} <span className="font-semibold text-violet-600">@ {exp.company}</span>
                </span>
                <span className="text-[8.5px] text-zinc-500 font-sans font-semibold whitespace-nowrap">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  {exp.location ? ` | ${exp.location}` : ""}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc pl-3 text-[9px] text-zinc-600 space-y-0.5 leading-relaxed font-sans">
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

    projects: projects.length > 0 ? (
      <div key="projects" className="space-y-2 pb-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-violet-700 border-b border-zinc-200 pb-0.5 font-sans">
          Key Projects
        </h4>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline text-[10px]">
                <div className="font-bold text-zinc-900 font-sans flex items-center gap-1.5">
                  {proj.name}
                </div>
                <div className="flex gap-2 text-[8px] text-zinc-500 font-sans">
                  {proj.githubUrl && <span className="flex items-center gap-0.5"><Github className="size-2" />{formatUrl(proj.githubUrl)}</span>}
                  {proj.liveUrl && <span className="flex items-center gap-0.5"><Globe className="size-2" />{formatUrl(proj.liveUrl)}</span>}
                </div>
              </div>
              <p className="text-[9px] text-zinc-600 leading-relaxed font-sans">
                {proj.description}
              </p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((t) => (
                    <span key={t} className="text-[8px] font-sans px-1 rounded-sm bg-violet-50 text-violet-600 border border-violet-100 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,
  };

  const sectionsLeft: Record<string, React.ReactNode> = {
    education: education.length > 0 ? (
      <div key="education" className="space-y-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-violet-400 border-b border-zinc-700/50 pb-0.5 font-sans">
          Education
        </h4>
        <div className="space-y-2.5">
          {education.map((edu) => (
            <div key={edu.id} className="space-y-0.5 text-[9px]">
              <p className="font-bold text-zinc-200 font-sans">{edu.degree}</p>
              <p className="text-zinc-400 font-sans">{edu.field}</p>
              <p className="text-zinc-400 font-sans font-semibold text-[8px]">{edu.institution}</p>
              <p className="text-zinc-500 font-sans text-[8px]">{edu.startDate} – {edu.endDate}</p>
              {edu.gpa && <p className="text-violet-400 font-sans text-[8px]">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    skills: skills.length > 0 ? (
      <div key="skills" className="space-y-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-violet-400 border-b border-zinc-700/50 pb-0.5 font-sans">
          Skills
        </h4>
        <div className="flex flex-wrap gap-1 pt-0.5">
          {skills.map((skill) => (
            <span key={skill} className="text-[8.5px] px-1.5 py-0.5 rounded-sm bg-zinc-800 text-zinc-300 border border-zinc-700/40 font-medium font-sans">
              {skill}
            </span>
          ))}
        </div>
      </div>
    ) : null,

    certifications: certifications.length > 0 ? (
      <div key="certifications" className="space-y-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-violet-400 border-b border-zinc-700/50 pb-0.5 font-sans">
          Certifications
        </h4>
        <div className="space-y-2 text-[9px]">
          {certifications.map((cert) => (
            <div key={cert.id} className="space-y-0.5">
              <p className="font-bold text-zinc-300 font-sans">{cert.name}</p>
              <p className="text-zinc-400 font-sans text-[8px]">{cert.issuer} • {cert.date}</p>
            </div>
          ))}
        </div>
      </div>
    ) : null,
  };

  const order = data.sectionOrder || ["summary", "experience", "education", "skills", "projects", "certifications"];

  return (
    <div className="max-w-4xl mx-auto bg-white text-zinc-900 shadow-sm min-h-[297mm] flex items-stretch overflow-hidden leading-normal">
      {/* Sidebar Column */}
      <div className="w-[32%] bg-zinc-900 text-zinc-150 p-6 flex flex-col gap-5 shrink-0">
        <div className="space-y-3 pb-4 border-b border-zinc-800">
          <h3 className="text-lg font-bold tracking-tight text-white leading-tight font-sans">
            {fullName || "Your Full Name"}
          </h3>
          <p className="text-[9.5px] font-medium text-violet-400 font-sans tracking-wide">
            {experience[0]?.position || "Professional Title"}
          </p>
        </div>

        {/* Contact info list */}
        <div className="space-y-2 text-[8.5px] text-zinc-300 font-sans">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-violet-400 border-b border-zinc-700/50 pb-0.5">
            Contact
          </h4>
          {personalInfo.email && (
            <p className="flex items-center gap-1.5 truncate">
              <Mail className="size-3 text-violet-400 shrink-0" />
              {personalInfo.email}
            </p>
          )}
          {personalInfo.phone && (
            <p className="flex items-center gap-1.5">
              <Phone className="size-3 text-violet-400 shrink-0" />
              {personalInfo.phone}
            </p>
          )}
          {personalInfo.location && (
            <p className="flex items-center gap-1.5">
              <MapPin className="size-3 text-violet-400 shrink-0" />
              {personalInfo.location}
            </p>
          )}
          {personalInfo.linkedin && (
            <p className="flex items-center gap-1.5 truncate">
              <Link2 className="size-3 text-violet-400 shrink-0" />
              {formatUrl(personalInfo.linkedin)}
            </p>
          )}
          {personalInfo.github && (
            <p className="flex items-center gap-1.5 truncate">
              <Github className="size-3 text-violet-400 shrink-0" />
              {formatUrl(personalInfo.github)}
            </p>
          )}
          {personalInfo.portfolio && (
            <p className="flex items-center gap-1.5 truncate">
              <Globe className="size-3 text-violet-400 shrink-0" />
              {formatUrl(personalInfo.portfolio)}
            </p>
          )}
        </div>

        {/* Left Column Sections */}
        {order.map((sec) => sectionsLeft[sec])}
      </div>

      {/* Main Content Column */}
      <div className="flex-1 p-7 flex flex-col gap-4 bg-white">
        {/* Right Column Sections */}
        {order.map((sec) => sectionsRight[sec])}
      </div>
    </div>
  );
}
