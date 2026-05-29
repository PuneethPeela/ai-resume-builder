"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePDFExport } from "@/hooks/usePDFExport";
import { useResumeStore } from "@/stores/resumeStore";
import { FileDown, ShieldCheck, Mail, Phone, MapPin, Sparkles, Loader2 } from "lucide-react";

export function PDFPreviewModal() {
  const { resumeData, template } = useResumeStore();
  const { exportPDF, isExporting } = usePDFExport();
  const [open, setOpen] = useState(false);

  const fullName = `${resumeData?.personalInfo?.firstName || ""} ${resumeData?.personalInfo?.lastName || ""}`.trim();
  const email = resumeData?.personalInfo?.email || "";
  const location = resumeData?.personalInfo?.location || "";

  const handleDownload = async () => {
    if (!resumeData) return;
    await exportPDF(resumeData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium gap-1.5 shadow-md shadow-violet-900/20 cursor-pointer"
          />
        }
      >
        <FileDown className="size-4" />
        <span>Export PDF</span>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 flex items-center gap-1.5">
            <ShieldCheck className="size-5 text-violet-400" />
            Export Professional PDF
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Generate and download your print-ready resume PDF. Fully compatible with ATS parsing systems.
          </DialogDescription>
        </DialogHeader>

        {/* Preview Details Box */}
        <div className="space-y-4 py-4 border-t border-b border-zinc-900 my-2 text-sm">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-900 space-y-3">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Candidate Profile</p>
              <h4 className="font-semibold text-zinc-200 text-base">{fullName || "Your Full Name"}</h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400 mt-1">
                {email && <span className="flex items-center gap-1"><Mail className="size-3 text-zinc-500" />{email}</span>}
                {location && <span className="flex items-center gap-1"><MapPin className="size-3 text-zinc-500" />{location}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-zinc-800 text-xs">
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Template</p>
                <p className="font-semibold text-violet-400 capitalize mt-0.5">{template}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">File Format</p>
                <p className="font-semibold text-zinc-300 mt-0.5">PDF (Vector Graphics)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-start text-xs text-zinc-400 p-3 rounded-lg bg-violet-650/5 border border-violet-500/10">
            <Sparkles className="size-4 text-violet-400 shrink-0 mt-0.5 animate-pulse" />
            <p>
              Your PDF is compiled directly in the browser as a standard high-quality vector document, ensuring clean typography and perfect margins for physical print.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5 font-medium min-w-[120px]"
          >
            {isExporting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="size-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
