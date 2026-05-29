"use client";

import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PersonalInfoSection() {
  const { resumeData, updatePersonalInfo } = useResumeStore();
  const info = resumeData?.personalInfo || {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  };

  const handleChange = (field: keyof typeof info, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-card/30 backdrop-blur-md rounded-xl border border-border/40">
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-zinc-200 font-medium">First Name</Label>
        <Input
          id="firstName"
          placeholder="John"
          value={info.firstName || ""}
          onChange={(e) => handleChange("firstName", e.target.value)}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-zinc-200 font-medium">Last Name</Label>
        <Input
          id="lastName"
          placeholder="Doe"
          value={info.lastName || ""}
          onChange={(e) => handleChange("lastName", e.target.value)}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-200 font-medium">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          value={info.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-zinc-200 font-medium">Phone Number</Label>
        <Input
          id="phone"
          placeholder="+1 (555) 000-0000"
          value={info.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="location" className="text-zinc-200 font-medium">Location</Label>
        <Input
          id="location"
          placeholder="San Francisco, CA"
          value={info.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin" className="text-zinc-200 font-medium">LinkedIn URL</Label>
        <Input
          id="linkedin"
          placeholder="linkedin.com/in/johndoe"
          value={info.linkedin || ""}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github" className="text-zinc-200 font-medium">GitHub URL</Label>
        <Input
          id="github"
          placeholder="github.com/johndoe"
          value={info.github || ""}
          onChange={(e) => handleChange("github", e.target.value)}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="portfolio" className="text-zinc-200 font-medium">Portfolio / Personal Website</Label>
        <Input
          id="portfolio"
          placeholder="johndoe.dev"
          value={info.portfolio || ""}
          onChange={(e) => handleChange("portfolio", e.target.value)}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500"
        />
      </div>
    </div>
  );
}
