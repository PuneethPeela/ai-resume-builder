"use client";

import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Plus, Trash2, Award, Calendar, Link } from "lucide-react";

export function CertificationsSection() {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResumeStore();
  const certifications = resumeData?.certifications || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Certifications</h3>
          <p className="text-xs text-zinc-500">List relevant industry credentials, certifications or training.</p>
        </div>
        <Button
          type="button"
          onClick={addCertification}
          size="sm"
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center gap-1 shadow-md shadow-violet-900/20"
        >
          <Plus className="size-4" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <Award className="size-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">No certifications added yet.</p>
          <Button
            type="button"
            variant="link"
            onClick={addCertification}
            className="text-violet-400 hover:text-violet-300 text-xs font-semibold mt-1"
          >
            Add your credentials
          </Button>
        </div>
      ) : (
        <Accordion className="space-y-3">
          {certifications.map((cert) => (
            <AccordionItem 
              key={cert.id} 
              value={cert.id}
              className="border border-border/40 bg-zinc-950/30 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between pr-4 bg-zinc-900/30">
                <AccordionTrigger className="flex-1 py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-left">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
                      <Award className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200 text-sm">
                        {cert.name || "Untitled Certification"}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {cert.issuer || "Issuing Organization"} 
                        {cert.date ? ` • ${cert.date}` : ""}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeCertification(cert.id)}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <AccordionContent className="p-4 space-y-4 border-t border-zinc-900/50 bg-zinc-950/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-zinc-300 font-medium">Certification Name</Label>
                    <Input
                      placeholder="AWS Certified Solutions Architect"
                      value={cert.name || ""}
                      onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium">Issuing Organization / Issuer</Label>
                    <Input
                      placeholder="Amazon Web Services"
                      value={cert.issuer || ""}
                      onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium flex items-center gap-1">
                      <Calendar className="size-3.5" /> Date Earned / Issued
                    </Label>
                    <Input
                      placeholder="Jan 2024"
                      value={cert.date || ""}
                      onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-zinc-300 font-medium flex items-center gap-1">
                      <Link className="size-3.5" /> Certification URL / Credential URL
                    </Label>
                    <Input
                      placeholder="https://credentials.example.com/aws-architect"
                      value={cert.url || ""}
                      onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
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
