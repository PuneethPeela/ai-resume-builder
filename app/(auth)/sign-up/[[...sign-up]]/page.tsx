"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, KeyRound, Mail, Sparkles, UserPlus, User } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const clerkKeyExists = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const handleLocalRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Account registered! Welcome, ${name}!`);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Network error during signup");
    } finally {
      setLoading(false);
    }
  };

  // If Clerk Publishable Key exists, render Clerk's standard sign-up view
  if (clerkKeyExists) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-bg font-sans">
        <div className="w-full max-w-md p-4">
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "glass shadow-2xl border-0",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
              },
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-violet-600/30 selection:text-violet-200 relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-violet-600/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-indigo-650/5 blur-3xl" />

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Logo brand */}
        <div className="flex items-center justify-center gap-1.5 select-none mb-2">
          <div className="size-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-650 flex items-center justify-center text-white shadow-md shadow-violet-950/30">
            <Sparkles className="size-4.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">ResumeAI Console</span>
        </div>

        {/* Credentials Register Form */}
        <Card className="glass border-zinc-900 bg-zinc-950/40 backdrop-blur-xl shadow-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <UserPlus className="size-4.5 text-violet-400" />
              <span>Create Credentials</span>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Register a mock profile for dynamic dashboard evaluation.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleLocalRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name" className="text-xs text-zinc-400">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                  <Input
                    id="reg-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Sharma"
                    className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-email" className="text-xs text-zinc-400">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                  <Input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-pass" className="text-xs text-zinc-400">Create Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                  <Input
                    id="reg-pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-role" className="text-xs text-zinc-400">Reviewer Test Role Selection</Label>
                <select
                  id="reg-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="user">User (Standard Candidate)</option>
                  <option value="sub_admin">Sub-Admin (Read-Only Panel)</option>
                  <option value="admin">Admin (Full Control Panel)</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-lg py-2.5 mt-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="size-4 animate-spin text-white mx-auto" /> : "Sign Up & Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="px-6 pb-6 border-t border-zinc-900/60 pt-4 flex justify-between text-xs text-zinc-500">
            <span>Already have an account?</span>
            <Link href="/sign-in" className="text-violet-400 hover:text-violet-300 font-semibold">
              Sign In Instead
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
