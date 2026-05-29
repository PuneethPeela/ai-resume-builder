import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  ResumeFormData,
  TemplateName,
  Experience,
  Education,
  Project,
  Certification,
} from "@/types/resume";
import {
  EMPTY_RESUME,
  createEmptyExperience,
  createEmptyEducation,
  createEmptyProject,
  createEmptyCertification,
} from "@/types/resume";

interface ResumeState {
  // ── Data ──
  resumeData: ResumeFormData;
  template: TemplateName;
  resumeId: string | null;
  isDirty: boolean;
  lastSavedAt: Date | null;

  // ── Actions: Resume Data ──
  setResumeData: (data: ResumeFormData) => void;
  updatePersonalInfo: (info: Partial<ResumeFormData["personalInfo"]>) => void;
  setSummary: (summary: string) => void;
  setSkills: (skills: string[]) => void;
  setSectionOrder: (order: string[]) => void;

  // ── Actions: Experience ──
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  updateBullet: (expId: string, bulletIndex: number, value: string) => void;
  addBullet: (expId: string) => void;
  removeBullet: (expId: string, bulletIndex: number) => void;

  // ── Actions: Education ──
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // ── Actions: Projects ──
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // ── Actions: Certifications ──
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // ── Actions: Meta ──
  setTemplate: (template: TemplateName) => void;
  setResumeId: (id: string | null) => void;
  markSaved: () => void;
  resetResume: () => void;
  loadResume: (data: ResumeFormData, id: string, template: TemplateName) => void;
}

export const useResumeStore = create<ResumeState>()(
  devtools(
    persist(
      (set) => ({
        // ── Initial State ──
        resumeData: EMPTY_RESUME,
        template: "classic",
        resumeId: null,
        isDirty: false,
        lastSavedAt: null,

        // ── Resume Data ──
        setResumeData: (data) =>
          set({ resumeData: data, isDirty: true }, false, "setResumeData"),

        updatePersonalInfo: (info) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                personalInfo: { ...state.resumeData.personalInfo, ...info },
              },
              isDirty: true,
            }),
            false,
            "updatePersonalInfo"
          ),

        setSummary: (summary) =>
          set(
            (state) => ({
              resumeData: { ...state.resumeData, summary },
              isDirty: true,
            }),
            false,
            "setSummary"
          ),

        setSkills: (skills) =>
          set(
            (state) => ({
              resumeData: { ...state.resumeData, skills },
              isDirty: true,
            }),
            false,
            "setSkills"
          ),

        setSectionOrder: (order) =>
          set(
            (state) => ({
              resumeData: { ...state.resumeData, sectionOrder: order },
              isDirty: true,
            }),
            false,
            "setSectionOrder"
          ),

        // ── Experience ──
        addExperience: () =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                experience: [...state.resumeData.experience, createEmptyExperience()],
              },
              isDirty: true,
            }),
            false,
            "addExperience"
          ),

        updateExperience: (id, data) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                experience: state.resumeData.experience.map((exp) =>
                  exp.id === id ? { ...exp, ...data } : exp
                ),
              },
              isDirty: true,
            }),
            false,
            "updateExperience"
          ),

        removeExperience: (id) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                experience: state.resumeData.experience.filter((e) => e.id !== id),
              },
              isDirty: true,
            }),
            false,
            "removeExperience"
          ),

        updateBullet: (expId, bulletIndex, value) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                experience: state.resumeData.experience.map((exp) => {
                  if (exp.id !== expId) return exp;
                  const bullets = [...exp.bullets];
                  bullets[bulletIndex] = value;
                  return { ...exp, bullets };
                }),
              },
              isDirty: true,
            }),
            false,
            "updateBullet"
          ),

        addBullet: (expId) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                experience: state.resumeData.experience.map((exp) =>
                  exp.id === expId ? { ...exp, bullets: [...exp.bullets, ""] } : exp
                ),
              },
              isDirty: true,
            }),
            false,
            "addBullet"
          ),

        removeBullet: (expId, bulletIndex) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                experience: state.resumeData.experience.map((exp) => {
                  if (exp.id !== expId) return exp;
                  return {
                    ...exp,
                    bullets: exp.bullets.filter((_, i) => i !== bulletIndex),
                  };
                }),
              },
              isDirty: true,
            }),
            false,
            "removeBullet"
          ),

        // ── Education ──
        addEducation: () =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                education: [...state.resumeData.education, createEmptyEducation()],
              },
              isDirty: true,
            }),
            false,
            "addEducation"
          ),

        updateEducation: (id, data) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                education: state.resumeData.education.map((edu) =>
                  edu.id === id ? { ...edu, ...data } : edu
                ),
              },
              isDirty: true,
            }),
            false,
            "updateEducation"
          ),

        removeEducation: (id) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                education: state.resumeData.education.filter((e) => e.id !== id),
              },
              isDirty: true,
            }),
            false,
            "removeEducation"
          ),

        // ── Projects ──
        addProject: () =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                projects: [...state.resumeData.projects, createEmptyProject()],
              },
              isDirty: true,
            }),
            false,
            "addProject"
          ),

        updateProject: (id, data) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                projects: state.resumeData.projects.map((p) =>
                  p.id === id ? { ...p, ...data } : p
                ),
              },
              isDirty: true,
            }),
            false,
            "updateProject"
          ),

        removeProject: (id) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                projects: state.resumeData.projects.filter((p) => p.id !== id),
              },
              isDirty: true,
            }),
            false,
            "removeProject"
          ),

        // ── Certifications ──
        addCertification: () =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                certifications: [
                  ...state.resumeData.certifications,
                  createEmptyCertification(),
                ],
              },
              isDirty: true,
            }),
            false,
            "addCertification"
          ),

        updateCertification: (id, data) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                certifications: state.resumeData.certifications.map((c) =>
                  c.id === id ? { ...c, ...data } : c
                ),
              },
              isDirty: true,
            }),
            false,
            "updateCertification"
          ),

        removeCertification: (id) =>
          set(
            (state) => ({
              resumeData: {
                ...state.resumeData,
                certifications: state.resumeData.certifications.filter(
                  (c) => c.id !== id
                ),
              },
              isDirty: true,
            }),
            false,
            "removeCertification"
          ),

        // ── Meta ──
        setTemplate: (template) =>
          set({ template, isDirty: true }, false, "setTemplate"),

        setResumeId: (id) => set({ resumeId: id }, false, "setResumeId"),

        markSaved: () =>
          set({ isDirty: false, lastSavedAt: new Date() }, false, "markSaved"),

        resetResume: () =>
          set(
            {
              resumeData: EMPTY_RESUME,
              template: "classic",
              resumeId: null,
              isDirty: false,
              lastSavedAt: null,
            },
            false,
            "resetResume"
          ),

        loadResume: (data, id, template) =>
          set(
            {
              resumeData: data,
              resumeId: id,
              template,
              isDirty: false,
              lastSavedAt: new Date(),
            },
            false,
            "loadResume"
          ),
      }),
      {
        name: "resume-store",
        partialize: (state) => ({
          resumeData: state.resumeData,
          template: state.template,
          resumeId: state.resumeId,
        }),
      }
    ),
    { name: "ResumeStore" }
  )
);
