"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  Loader2, 
  FileText, 
  AlertCircle, 
  Check, 
  X, 
  Sparkles 
} from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ImportResumeButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ["pdf", "csv", "txt", "json"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      toast.error("Unsupported file format! Please upload PDF, CSV, TXT, or JSON.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large! Maximum limit is 5MB.");
      return;
    }

    setSelectedFile(file);
    toast.success(`Selected "${file.name}"`);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload first!");
      return;
    }

    setUploading(true);
    setUploadProgress(15);
    
    // Simulate step progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    const toastId = toast.loading(`Uploading & AI parsing "${selectedFile.name}"...`);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("createWorkspace", "true");

      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(95);

      const result = await response.json();

      if (result.success && result.resume) {
        setUploadProgress(100);
        toast.success("AI extraction complete! Redirecting...", { id: toastId });
        setOpen(false);
        // Clear inputs
        setSelectedFile(null);
        // Redirect to new resume page
        router.push(`/dashboard/${result.resume.id}`);
      } else {
        toast.error(result.error || "Failed to parse resume.", { id: toastId });
        setUploadProgress(0);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      toast.error("Network error during file parsing.", { id: toastId });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="group relative h-48 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-violet-500/50 bg-zinc-950/20 hover:bg-violet-500/5 flex flex-col items-center justify-center gap-3 p-6 transition-all duration-300 shadow-inner cursor-pointer"
          >
            <div className="size-12 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-violet-500/30 flex items-center justify-center text-zinc-400 group-hover:text-violet-400 group-hover:scale-105 transition-all duration-300">
              <UploadCloud className="size-5" />
            </div>
            
            <div className="text-center">
              <p className="font-semibold text-sm text-zinc-300 group-hover:text-zinc-200">
                Import from File
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Upload PDF, CSV, or TXT for AI pre-fill
              </p>
            </div>
          </button>
        }
      />

      <DialogContent className="sm:max-w-md border border-zinc-800 bg-zinc-950 text-zinc-100 p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-zinc-100">
            <Sparkles className="size-4 text-violet-400" />
            <span>AI Resume File Parser</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Upload your existing PDF, CSV, TXT, or JSON resume. Our Gemini AI parser will auto-populate a brand new workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Drag and Drop Zone */}
          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                dragActive 
                  ? "border-violet-500 bg-violet-500/5" 
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/10 hover:bg-zinc-900/25"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.csv,.txt,.json"
                onChange={handleFileChange}
                disabled={uploading}
              />
              
              <div className="size-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <UploadCloud className="size-5" />
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-zinc-300">
                  Drag & drop your file here, or <span className="text-violet-400 underline">browse</span>
                </p>
                <p className="text-[10px] text-zinc-500">
                  Supports PDF, CSV, TXT, JSON up to 5MB
                </p>
              </div>
            </div>
          ) : (
            /* Selected File View */
            <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/20 backdrop-blur-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-violet-400 shrink-0">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-200 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {!uploading && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="size-7 rounded-md hover:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          )}

          {/* Progress loader */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="size-3 animate-spin text-violet-400" />
                  <span>Gemini AI is parsing resume content...</span>
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 text-center italic">
                Extracting contact info, experience history, skills, and projects
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
          <DialogClose
            render={
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900" disabled={uploading}>
                Cancel
              </Button>
            }
          />
          <Button
            onClick={handleUploadSubmit}
            disabled={!selectedFile || uploading}
            className="bg-violet-600 hover:bg-violet-500 text-zinc-100 font-semibold flex items-center gap-1.5"
          >
            {uploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Parsing...</span>
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                <span>Confirm & Upload</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
