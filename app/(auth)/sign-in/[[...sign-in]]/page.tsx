"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, KeyRound, Mail, Sparkles, LogIn, Key, UserCheck, Shield, User } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password reset dialog states
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const clerkKeyExists = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Welcome back, ${result.data.name}!`);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Authentication failed");
      }
    } catch (err) {
      toast.error("Network error during login");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Password reset verified and saved!");
        setShowResetDialog(false);
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(result.error || "Password reset validation failed");
      }
    } catch (err) {
      toast.error("Network error resetting password");
    } finally {
      setResetLoading(false);
    }
  };

  const handleAutofill = async (role: "admin" | "sub_admin" | "user") => {
    setLoading(true);
    let targetEmail = "";
    let targetName = "";
    let targetPass = "";

    if (role === "admin") {
      targetEmail = "admin@resumeai.com";
      targetName = "Admin Puneeth";
      targetPass = "admin123";
    } else if (role === "sub_admin") {
      targetEmail = "subadmin@resumeai.com";
      targetName = "Sub-Admin Arjun";
      targetPass = "subadmin123";
    } else {
      targetEmail = "user@resumeai.com";
      targetName = "Priya Patel";
      targetPass = "user123";
    }

    try {
      // Register first (just in case they don't exist in local DB yet)
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPass, name: targetName, role }),
      });

      // Login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPass }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(`Logged in as ${role === "sub_admin" ? "Sub-Admin" : role}!`);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Autofill auth failed");
      }
    } catch (err) {
      toast.error("Autofill process error");
    } finally {
      setLoading(false);
    }
  };

  // If Clerk Publishable Key exists, render Clerk's standard premium view
  if (clerkKeyExists) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-bg font-sans">
        <div className="w-full max-w-md p-4">
          <SignIn
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

        {showResetDialog ? (
          /* Password Reset UI View */
          <Card className="glass border-zinc-900 bg-zinc-950/40 backdrop-blur-xl shadow-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Key className="size-4.5 text-violet-400" />
                <span>Security Password Reset</span>
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                To confirm updates, you must enter both your current active password and new password credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="old-pass" className="text-xs text-zinc-400">Current Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                    <Input
                      id="old-pass"
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-pass" className="text-xs text-zinc-400">New Secure Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                    <Input
                      id="new-pass"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowResetDialog(false)}
                    className="text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Back to Login
                  </Button>
                  <Button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-lg"
                    disabled={resetLoading}
                  >
                    {resetLoading ? <Loader2 className="size-3.5 animate-spin" /> : "Save New Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Credentials Form UI View */
          <Card className="glass border-zinc-900 bg-zinc-950/40 backdrop-blur-xl shadow-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <LogIn className="size-4.5 text-violet-400" />
                <span>Console Sign In</span>
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Enter your credentials or use the single-click reviewer seed roles below.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-5">
              
              {/* Reviewer Quick Autofill Options */}
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Reviewer Quick-Autofill</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAutofill("admin")}
                    className="text-[10px] py-1 border-violet-950/20 bg-violet-600/5 hover:bg-violet-600/10 text-violet-400 hover:text-violet-300 font-semibold gap-1"
                  >
                    <Shield className="size-3" />
                    <span>Admin</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAutofill("sub_admin")}
                    className="text-[10px] py-1 border-amber-950/20 bg-amber-600/5 hover:bg-amber-600/10 text-amber-400 hover:text-amber-300 font-semibold gap-1"
                  >
                    <UserCheck className="size-3" />
                    <span>Sub-Admin</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAutofill("user")}
                    className="text-[10px] py-1 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 text-zinc-300 hover:text-white font-semibold gap-1"
                  >
                    <User className="size-3" />
                    <span>Candidate</span>
                  </Button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-900/80"></div>
                <span className="flex-shrink mx-3 text-[10px] text-zinc-600 font-bold uppercase">or sign in with credentials</span>
                <div className="flex-grow border-t border-zinc-900/80"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLocalLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-zinc-400">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="candidate@example.com"
                      className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="pass" className="text-xs text-zinc-400">Password</Label>
                    <button
                      type="button"
                      onClick={() => setShowResetDialog(true)}
                      className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold focus:outline-none"
                    >
                      Reset Password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                    <Input
                      id="pass"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-lg py-2.5 mt-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="size-4 animate-spin text-white mx-auto" /> : "Sign In to Workspace"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="px-6 pb-6 border-t border-zinc-900/60 pt-4 flex justify-between text-xs text-zinc-500">
              <span>New to ResumeAI?</span>
              <Link href="/sign-up" className="text-violet-400 hover:text-violet-300 font-semibold">
                Create Free Account
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
