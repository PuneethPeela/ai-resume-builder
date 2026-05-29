"use client";

import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Plus, Trash2, Calendar, Award, GraduationCap } from "lucide-react";

export function EducationSection() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeStore();
  const education = resumeData?.education || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Education</h3>
          <p className="text-xs text-zinc-500">Add your academic background and achievements.</p>
        </div>
        <Button
          type="button"
          onClick={addEducation}
          size="sm"
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center gap-1 shadow-md shadow-violet-900/20"
        >
          <Plus className="size-4" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <GraduationCap className="size-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">No education entries added yet.</p>
          <Button
            type="button"
            variant="link"
            onClick={addEducation}
            className="text-violet-400 hover:text-violet-300 text-xs font-semibold mt-1"
          >
            Add your degree or diploma
          </Button>
        </div>
      ) : (
        <Accordion className="space-y-3">
          {education.map((edu) => (
            <AccordionItem 
              key={edu.id} 
              value={edu.id}
              className="border border-border/40 bg-zinc-950/30 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between pr-4 bg-zinc-900/30">
                <AccordionTrigger className="flex-1 py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-left">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
                      <GraduationCap className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200 text-sm">
                        {edu.degree || "Degree"} in {edu.field || "Field of Study"}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {edu.institution || "Institution Name"} 
                        {edu.startDate ? ` • ${edu.startDate} - ${edu.endDate || "Ongoing"}` : ""}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeEducation(edu.id)}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <AccordionContent className="p-4 space-y-4 border-t border-zinc-900/50 bg-zinc-950/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-zinc-300 font-medium">Institution / School Name</Label>
                    <Input
                      placeholder="University of California, Berkeley"
                      value={edu.institution || ""}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium">Degree / Diploma</Label>
                    <Input
                      placeholder="Bachelor of Science"
                      value={edu.degree || ""}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium">Field of Study</Label>
                    <Input
                      placeholder="Computer Science"
                      value={edu.field || ""}
                      onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium flex items-center gap-1">
                      <Calendar className="size-3.5" /> Start Date
                    </Label>
                    <Input
                      placeholder="Sep 2020"
                      value={edu.startDate || ""}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium flex items-center gap-1">
                      <Calendar className="size-3.5" /> End Date
                    </Label>
                    <Input
                      placeholder="May 2024"
                      value={edu.endDate || ""}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-zinc-300 font-medium flex items-center gap-1">
                      <Award className="size-3.5" /> GPA or Grade
                    </Label>
                    <Input
                      placeholder="3.8 / 4.0"
                      value={edu.gpa || ""}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
