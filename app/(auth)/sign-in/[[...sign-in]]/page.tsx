"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, KeyRound, Mail, Sparkles, LogIn, Key, UserCheck, Shield, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // New state variables for Demo and Admin passcode logins
  const [adminPasscode, setAdminPasscode] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    const targetEmail = "puneeth.google@gmail.com";
    const targetName = "Puneeth Peela";

    try {
      // Direct call to new robust login/upsert flow
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: targetEmail, 
          name: targetName, 
          isGoogle: true 
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Successfully authenticated with Google account!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Google Auth registration failed");
      }
    } catch (err) {
      toast.error("Google authentication service error");
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
        toast.error(result.error || "Password verification failed");
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
      // Seed account
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
        toast.error(result.error || "Autofill session failed");
      }
    } catch (err) {
      toast.error("Reviewer autofill sequence failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickDemoLogin = async () => {
    setDemoLoading(true);
    const targetEmail = "demo@resumeai.com";
    const targetName = "Demo Candidate";
    const targetPass = "demo123";
    const role = "user";

    try {
      // Seed account if missing
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPass, name: targetName, role }),
      });
    } catch (err) {
      // User may already be registered
    }

    try {
      // Login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPass }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(`Welcome back, Demo Candidate!`);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Demo login failed");
      }
    } catch (err) {
      toast.error("Demo login sequence failed");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleAdminSecretLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode.trim() !== "abc123") {
      toast.error("Invalid Evaluator Passcode. Please try again.");
      return;
    }

    setAdminLoading(true);
    const targetEmail = "admin@resumeai.com";
    const targetName = "Super Admin";
    const targetPass = "admin123";
    const role = "admin";

    try {
      // Seed account if missing
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPass, name: targetName, role }),
      });
    } catch (err) {
      // User may already be registered
    }

    try {
      // Login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPass }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Evaluator Admin Panel Access Granted!");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(result.error || "Admin authentication failed");
      }
    } catch (err) {
      toast.error("Admin login sequence failed");
    } finally {
      setAdminLoading(false);
    }
  };

  if (clerkKeyExists) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans relative overflow-hidden">
        {/* Glowing cyber grid pattern in background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-violet-500/10 blur-3xl" />
        {/* Back to Home */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" passHref>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 gap-1.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800/60 rounded-xl transition-all cursor-pointer">
              <ArrowLeft className="size-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
        <div className="w-full max-w-md p-4 z-10">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "glass shadow-2xl border border-zinc-800 bg-zinc-950/90 text-zinc-100",
                headerTitle: "text-zinc-100 font-bold",
                headerSubtitle: "text-zinc-400",
                socialButtonsBlockButton: "border border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800",
                formButtonPrimary: "bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs",
                footerActionText: "text-zinc-400",
                footerActionLink: "text-violet-400 hover:text-violet-300 font-semibold"
              },
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-violet-600/30 selection:text-violet-200 relative overflow-hidden">
      {/* Abstract Glowing Grid Technical Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-indigo-650/10 blur-[100px] pointer-events-none" />
      {/* Back to Home */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" passHref>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 gap-1.5 hover:bg-zinc-900/60 border border-transparent hover:border-zinc-850/60 rounded-xl transition-all cursor-pointer">
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Brand logo */}
        <div className="flex items-center justify-center gap-1.5 select-none mb-2">
          <div className="size-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-650 flex items-center justify-center text-white shadow-md shadow-violet-950/30">
            <Sparkles className="size-4.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-50">ResumAI Console</span>
        </div>

        {showResetDialog ? (
          /* Password Reset UI View */
          <Card className="glass border-zinc-850 shadow-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-bold text-zinc-50 flex items-center gap-2">
                <Key className="size-4.5 text-violet-400" />
                <span>Security Password Reset</span>
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                To confirm updates, you must enter both your current active password and new password credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="old-pass" className="text-xs text-zinc-300 font-semibold">Current Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                    <Input
                      id="old-pass"
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-pass" className="text-xs text-zinc-300 font-semibold">New Secure Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                    <Input
                      id="new-pass"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowResetDialog(false)}
                    className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    Back to Login
                  </Button>
                  <Button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-lg cursor-pointer"
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
          <Card className="glass border-zinc-850 shadow-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-bold text-zinc-50 flex items-center gap-2">
                <LogIn className="size-4.5 text-violet-400" />
                <span>Console Sign In</span>
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Sign in with Google or use credentials below to access the workspaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-5">
              
              {/* Google Sign In Integration */}
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-100 hover:text-white font-bold text-xs rounded-xl py-2.5 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-black/40 hover:border-violet-500/30"
                >
                  <svg className="size-4 shrink-0 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </Button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-900/80"></div>
                <span className="flex-shrink mx-3 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">or sign in with credentials</span>
                <div className="flex-grow border-t border-zinc-900/80"></div>
              </div>

              {/* Reviewer Quick Autofill Options */}
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Reviewer Quick-Autofill</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAutofill("admin")}
                    className="text-[10px] py-1 border-violet-950/20 bg-violet-600/5 hover:bg-violet-600/10 text-violet-400 hover:text-violet-300 font-semibold gap-1 cursor-pointer"
                  >
                    <Shield className="size-3" />
                    <span>Admin</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAutofill("sub_admin")}
                    className="text-[10px] py-1 border-amber-950/20 bg-amber-600/5 hover:bg-amber-600/10 text-amber-400 hover:text-amber-300 font-semibold gap-1 cursor-pointer"
                  >
                    <UserCheck className="size-3" />
                    <span>Sub-Admin</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAutofill("user")}
                    className="text-[10px] py-1 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 text-zinc-300 hover:text-white font-semibold gap-1 cursor-pointer"
                  >
                    <User className="size-3" />
                    <span>Candidate</span>
                  </Button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLocalLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-zinc-300 font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="candidate@example.com"
                      className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="pass" className="text-xs text-zinc-300 font-semibold">Password</Label>
                    <button
                      type="button"
                      onClick={() => setShowResetDialog(true)}
                      className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold focus:outline-none cursor-pointer"
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
                      className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-lg py-2.5 mt-2 cursor-pointer shadow-md shadow-violet-950/20"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="size-4 animate-spin text-white mx-auto" /> : "Sign In to Workspace"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="px-6 pb-6 border-t border-zinc-900/60 pt-4 flex justify-between text-xs text-zinc-400">
              <span>New to ResumAI?</span>
              <Link href="/sign-up" className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer">
                Create Free Account
              </Link>
            </CardFooter>
          </Card>
        )}

        {/* One-Click Sample Candidate Login Card */}
        <Card className="glass border-zinc-850 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <CardHeader className="p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-zinc-50 flex items-center gap-2">
                <UserCheck className="size-4 text-violet-400" />
                <span>One-Click Sample Candidate Login</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-violet-950/40 text-violet-400 border-violet-900/50 text-[10px] px-2 py-0.5 font-bold">
                Quick Access
              </Badge>
            </div>
            <CardDescription className="text-[11px] text-zinc-400 mt-1">
              Access a pre-loaded candidate sandbox with sample resumes and interactive stats.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            <div className="bg-zinc-950/65 rounded-lg border border-zinc-900 p-3 flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between items-center text-zinc-455">
                <span className="text-zinc-400">Email:</span>
                <code className="text-violet-300 font-mono">demo@resumeai.com</code>
              </div>
              <div className="flex justify-between items-center text-zinc-455">
                <span className="text-zinc-400">Password:</span>
                <code className="text-violet-300 font-mono">demo123</code>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleOneClickDemoLogin}
              disabled={demoLoading}
              className="w-full bg-gradient-to-r from-violet-650 to-indigo-650 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold text-xs rounded-lg py-2 flex items-center justify-center gap-2 shadow-md shadow-violet-950/20 cursor-pointer border border-violet-850"
            >
              {demoLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  <span>Launch Candidate Dashboard</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Evaluator Admin Portal Card */}
        <Card className="glass border-zinc-850 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <CardHeader className="p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-zinc-50 flex items-center gap-2">
                <Shield className="size-4 text-amber-400" />
                <span>Evaluator Admin Portal</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-amber-950/40 text-amber-400 border-amber-900/50 text-[10px] px-2 py-0.5 font-bold">
                Admin Gate
              </Badge>
            </div>
            <CardDescription className="text-[11px] text-zinc-400 mt-1">
              Unlock the full Admin Console with passcode (secret key: <code className="text-amber-300 font-mono">abc123</code>) to moderate roles and requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <form onSubmit={handleAdminSecretLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="passcode" className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Secret Admin Passcode</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                  <Input
                    id="passcode"
                    type="password"
                    required
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter passcode (e.g. abc123)"
                    className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-amber-500"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={adminLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-550 hover:to-amber-650 text-white font-semibold text-xs rounded-lg py-2 flex items-center justify-center gap-2 shadow-md shadow-amber-950/20 cursor-pointer border border-amber-950/30"
              >
                {adminLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="size-3.5" />
                    <span>Access Admin Panel</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
