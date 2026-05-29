"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "@/components/pdf/PDFDocument";
import type { ResumeFormData } from "@/types/resume";
import { toast } from "sonner";

export function usePDFExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async (data: ResumeFormData) => {
    if (!data) {
      toast.error("No resume data to export");
      return;
    }

    const fullName = `${data.personalInfo?.firstName || "My"}_${data.personalInfo?.lastName || "Resume"}`.trim();
    const filename = `${fullName}_CV.pdf`.replace(/\s+/g, "_");

    setIsExporting(true);
    const toastId = toast.loading("Generating print-ready PDF...");

    try {
      const doc = React.createElement(PDFDocument, { data });
      const blob = await pdf(doc as any).toBlob();

      // Download trigger
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF Downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return { exportPDF, isExporting };
}
