"use client";

import { ResumeFormData, EMPTY_RESUME } from "@/types/resume";
import { Mail, Phone, MapPin, Link2, Github } from "lucide-react";

interface TemplateProps {
  data: ResumeFormData;
}

export function ClassicTemplate({ data }: TemplateProps) {
  const { personalInfo = EMPTY_RESUME.personalInfo, summary = "", experience = [], education = [], skills = [], projects = [], certifications = [] } = data || {};
  const fullName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim();

  // Helper to format URLs for display (stripping https://)
  const formatUrl = (url?: string) => {
    if (!url) return "";
    return url.replace(/^(https?:\/\/)?(www\.)?/, "");
  };

  const sections: Record<string, React.ReactNode> = {
    summary: summary ? (
      <div key="summary" className="space-y-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-0.5 font-serif">
          Summary
        </h4>
        <p className="text-[10px] text-zinc-700 leading-relaxed text-justify font-serif">
          {summary}
        </p>
      </div>
    ) : null,

    experience: experience.length > 0 ? (
      <div key="experience" className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-0.5 font-serif">
          Experience
        </h4>
        <div className="space-y-2">
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline text-[10.5px]">
                <span className="font-bold text-zinc-800 font-serif">
                  {exp.position} — <span className="font-medium text-zinc-700">{exp.company}</span>
                </span>
                <span className="text-[9.5px] text-zinc-600 font-serif whitespace-nowrap">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  {exp.location ? ` | ${exp.location}` : ""}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc pl-3 text-[9.5px] text-zinc-700 space-y-0.5 leading-relaxed font-serif">
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
      <div key="education" className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-0.5 font-serif">
          Education
        </h4>
        <div className="space-y-2">
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline text-[10.5px]">
              <div>
                <span className="font-bold text-zinc-800 font-serif">{edu.institution}</span>
                <span className="text-zinc-700 font-serif">
                  {" "}— {edu.degree} in {edu.field}
                </span>
              </div>
              <span className="text-[9.5px] text-zinc-600 font-serif whitespace-nowrap">
                {edu.startDate} – {edu.endDate}
                {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    skills: skills.length > 0 ? (
      <div key="skills" className="space-y-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-0.5 font-serif">
          Skills
        </h4>
        <p className="text-[10px] text-zinc-700 leading-relaxed font-serif">
          <span className="font-bold text-zinc-800">Skills: </span>
          {skills.join(", ")}
        </p>
      </div>
    ) : null,

    projects: projects.length > 0 ? (
      <div key="projects" className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-0.5 font-serif">
          Projects
        </h4>
        <div className="space-y-2">
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline text-[10.5px]">
                <div className="font-bold text-zinc-800 font-serif flex items-center gap-1.5">
                  {proj.name}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[8.5px] font-normal font-sans px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                      {proj.technologies.join(", ")}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 text-[9px] text-zinc-600 font-serif">
                  {proj.githubUrl && <span>GitHub: {formatUrl(proj.githubUrl)}</span>}
                  {proj.liveUrl && <span>Live: {formatUrl(proj.liveUrl)}</span>}
                </div>
              </div>
              <p className="text-[9.5px] text-zinc-700 leading-relaxed font-serif">
                {proj.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    certifications: certifications.length > 0 ? (
      <div key="certifications" className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-300 pb-0.5 font-serif">
          Certifications
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline text-[9.5px] text-zinc-700 font-serif">
              <span>
                <span className="font-bold text-zinc-800">{cert.name}</span> — {cert.issuer}
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
    <div className="p-8 space-y-4 max-w-4xl mx-auto bg-white text-zinc-900 shadow-sm min-h-[297mm] resume-preview leading-normal font-serif">
      {/* Header */}
      <div className="text-center space-y-1 pb-2 border-b-2 border-zinc-800">
        <h3 className="text-2xl font-bold tracking-tight text-zinc-900 font-serif">
          {fullName || "Your Full Name"}
        </h3>
        
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9.5px] text-zinc-600 font-sans">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="size-2.5 text-zinc-400" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="size-2.5 text-zinc-400" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-2.5 text-zinc-400" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Link2 className="size-2.5 text-zinc-400" />
              {formatUrl(personalInfo.linkedin)}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="size-2.5 text-zinc-400" />
              {formatUrl(personalInfo.github)}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Link2 className="size-2.5 text-zinc-400" />
              {formatUrl(personalInfo.portfolio)}
            </span>
          )}
        </div>
      </div>

      {/* Ordered Sections */}
      <div className="space-y-4 pt-1">
        {order.map((sec) => sections[sec])}
      </div>
    </div>
  );
}
