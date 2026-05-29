"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { ResumeFormData, EMPTY_RESUME } from "@/types/resume";

// Register fonts if needed, but standard PDF fonts (Helvetica, Times-Roman) work out of the box and are extremely reliable.
// Let's use 'Times-Roman' (serif) to match the Classic template.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#222222",
    lineHeight: 1.4,
  },
  headerContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#333333",
    paddingBottom: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  fullName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111111",
  },
  contactDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    fontSize: 8.5,
    color: "#555555",
    gap: 8,
  },
  sectionContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 0.8,
    borderBottomColor: "#dddddd",
    paddingBottom: 2,
    marginBottom: 4,
    color: "#333333",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  entryTitle: {
    fontWeight: "bold",
    fontSize: 9.5,
    color: "#222222",
  },
  entryMeta: {
    fontSize: 8.5,
    color: "#666666",
  },
  bulletList: {
    paddingLeft: 12,
    marginTop: 2,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletChar: {
    width: 8,
    fontSize: 9,
    color: "#666666",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: "#444444",
  },
  textRegular: {
    fontSize: 9,
    color: "#444444",
    textAlign: "justify",
  },
  skillsText: {
    fontSize: 9,
    color: "#444444",
  },
  projectsContainer: {
    marginBottom: 4,
  },
  projTechs: {
    fontSize: 7.5,
    color: "#666666",
    fontFamily: "Helvetica",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginLeft: 6,
  },
});

interface PDFDocumentProps {
  data: ResumeFormData;
}

export function PDFDocument({ data }: PDFDocumentProps) {
  const { personalInfo = EMPTY_RESUME.personalInfo, summary = "", experience = [], education = [], skills = [], projects = [], certifications = [] } = data || {};
  const fullName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim();

  const formatUrl = (url?: string) => {
    if (!url) return "";
    return url.replace(/^(https?:\/\/)?(www\.)?/, "");
  };

  const sections: Record<string, React.ReactNode> = {
    summary: summary ? (
      <View key="summary" style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.textRegular}>{summary}</Text>
      </View>
    ) : null,

    experience: experience.length > 0 ? (
      <View key="experience" style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Experience</Text>
        {experience.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 6 }}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>
                {exp.position} — {exp.company}
              </Text>
              <Text style={styles.entryMeta}>
                {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                {exp.location ? ` | ${exp.location}` : ""}
              </Text>
            </View>
            {exp.bullets && exp.bullets.length > 0 && (
              <View style={styles.bulletList}>
                {exp.bullets.filter(b => b.trim() !== "").map((bullet, i) => (
                  <View key={i} style={styles.bulletPoint}>
                    <Text style={styles.bulletChar}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    ) : null,

    education: education.length > 0 ? (
      <View key="education" style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Education</Text>
        {education.map((edu) => (
          <View key={edu.id} style={styles.entryHeader}>
            <Text style={styles.entryTitle}>
              {edu.degree} in {edu.field} — {edu.institution}
            </Text>
            <Text style={styles.entryMeta}>
              {edu.startDate} – {edu.endDate}
              {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
            </Text>
          </View>
        ))}
      </View>
    ) : null,

    skills: skills.length > 0 ? (
      <View key="skills" style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.skillsText}>
          <Text style={{ fontWeight: "bold" }}>Skills: </Text>
          {skills.join(", ")}
        </Text>
      </View>
    ) : null,

    projects: projects.length > 0 ? (
      <View key="projects" style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Projects</Text>
        {projects.map((proj) => (
          <View key={proj.id} style={styles.projectsContainer}>
            <View style={styles.entryHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.entryTitle}>{proj.name}</Text>
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={styles.projTechs}>
                    {proj.technologies.join(", ")}
                  </Text>
                )}
              </View>
              <Text style={styles.entryMeta}>
                {proj.liveUrl ? `Live: ${formatUrl(proj.liveUrl)}` : ""}
                {proj.githubUrl && proj.liveUrl ? " | " : ""}
                {proj.githubUrl ? `Code: ${formatUrl(proj.githubUrl)}` : ""}
              </Text>
            </View>
            <Text style={styles.textRegular}>{proj.description}</Text>
          </View>
        ))}
      </View>
    ) : null,

    certifications: certifications.length > 0 ? (
      <View key="certifications" style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        {certifications.map((cert) => (
          <View key={cert.id} style={[styles.entryHeader, { marginBottom: 2 }]}>
            <Text style={styles.entryTitle}>
              {cert.name} — {cert.issuer}
            </Text>
            <Text style={styles.entryMeta}>{cert.date}</Text>
          </View>
        ))}
      </View>
    ) : null,
  };

  const order = data.sectionOrder || ["summary", "experience", "education", "skills", "projects", "certifications"];

  return (
    <Document title={`${fullName || "Resume"}_CV.pdf`} author={fullName} subject="Professional Resume" creator="ResumeAI Builder">
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.fullName}>{fullName || "Your Full Name"}</Text>
          <View style={styles.contactDetails}>
            {personalInfo.email && <Text>Email: {personalInfo.email}</Text>}
            {personalInfo.phone && <Text>Phone: {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>Location: {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text>LinkedIn: {formatUrl(personalInfo.linkedin)}</Text>}
            {personalInfo.github && <Text>GitHub: {formatUrl(personalInfo.github)}</Text>}
            {personalInfo.portfolio && <Text>Portfolio: {formatUrl(personalInfo.portfolio)}</Text>}
          </View>
        </View>

        {/* Dynamic sections ordered */}
        {order.map((sec) => sections[sec])}
      </Page>
    </Document>
  );
}
