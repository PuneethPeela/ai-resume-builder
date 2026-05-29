"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, KeyRound, Mail, Sparkles, UserPlus, User, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Touched state tracking for high-fidelity forms
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const clerkKeyExists = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Real-time dynamic validation messages
  const nameError = !name.trim() 
    ? "Full Name is required" 
    : name.trim().length < 2 
      ? "Full Name must be at least 2 characters" 
      : "";

  const emailError = !email.trim() 
    ? "Email Address is required" 
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) 
      ? "Please enter a valid email address format" 
      : "";

  const passwordError = !password 
    ? "Password is required" 
    : password.length < 6 
      ? "Password must be at least 6 characters" 
      : "";

  const confirmPasswordError = !confirmPassword 
    ? "Please confirm your password" 
    : confirmPassword !== password 
      ? "Passwords are not same" 
      : "";

  const isFormValid = !nameError && !emailError && !passwordError && !confirmPasswordError;

  const handleLocalRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched to trigger real-time error styles globally
    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    // Hard check validation for explicit descriptive toast feedback
    if (nameError) {
      toast.error(`Registration Failed: ${nameError}!`);
      return;
    }
    if (emailError) {
      toast.error(`Registration Failed: ${emailError}!`);
      return;
    }
    if (passwordError) {
      toast.error(`Registration Failed: ${passwordError}!`);
      return;
    }
    if (confirmPasswordError) {
      toast.error(`Registration Failed: ${confirmPasswordError}!`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role: "user" }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Account registered successfully! Welcome, ${name}!`);
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

  const handleGoogleRegister = async () => {
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
        toast.success("Successfully registered and authenticated via Google!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Google registration failed");
      }
    } catch (err) {
      toast.error("Google authentication service mapping failed");
    } finally {
      setLoading(false);
    }
  };

  if (clerkKeyExists) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans relative overflow-hidden">
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
          <SignUp
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

        {/* Credentials Register Form */}
        <Card className="glass border-zinc-850 shadow-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-base font-bold text-zinc-50 flex items-center gap-2">
              <UserPlus className="size-4.5 text-violet-400" />
              <span>Create Credentials</span>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Register a mock profile for dynamic dashboard evaluation.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-5">
            
            {/* Google Sign In Integration */}
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleGoogleRegister}
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
                <span>Register with Google</span>
              </Button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-900/80"></div>
              <span className="flex-shrink mx-3 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">or register with credentials</span>
              <div className="flex-grow border-t border-zinc-900/80"></div>
            </div>

            {/* Standard Register Form */}
            <form onSubmit={handleLocalRegister} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-name" className="text-xs text-zinc-300 font-semibold flex items-center justify-between">
                  <span>Full Name</span>
                  {name.trim().length >= 2 && !nameError && <CheckCircle className="size-3.5 text-emerald-400" />}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                  <Input
                    id="reg-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                    placeholder="Arjun Sharma"
                    className={`pl-9 bg-zinc-900 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 ${
                      nameTouched && nameError ? "border-red-500 focus-visible:ring-red-500 animate-shake" : "border-zinc-800"
                    }`}
                  />
                </div>
                {nameTouched && nameError && (
                  <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                    <AlertCircle className="size-3" />
                    <span>{nameError}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-email" className="text-xs text-zinc-300 font-semibold flex items-center justify-between">
                  <span>Email Address</span>
                  {email.trim().length > 0 && !emailError && <CheckCircle className="size-3.5 text-emerald-400" />}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                  <Input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="arjun@example.com"
                    className={`pl-9 bg-zinc-900 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 ${
                      emailTouched && emailError ? "border-red-500 focus-visible:ring-red-500 animate-shake" : "border-zinc-800"
                    }`}
                  />
                </div>
                {emailTouched && emailError && (
                  <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                    <AlertCircle className="size-3" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-pass" className="text-xs text-zinc-300 font-semibold flex items-center justify-between">
                  <span>Create Password</span>
                  {password.length >= 6 && !passwordError && <CheckCircle className="size-3.5 text-emerald-400" />}
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                  <Input
                    id="reg-pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Minimum 6 characters"
                    className={`pl-9 bg-zinc-900 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 ${
                      passwordTouched && passwordError ? "border-red-500 focus-visible:ring-red-500 animate-shake" : "border-zinc-800"
                    }`}
                  />
                </div>
                {passwordTouched && passwordError && (
                  <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                    <AlertCircle className="size-3" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm-pass" className="text-xs text-zinc-300 font-semibold flex items-center justify-between">
                  <span>Confirm Password</span>
                  {confirmPassword.length > 0 && !confirmPasswordError && <CheckCircle className="size-3.5 text-emerald-400" />}
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                  <Input
                    id="confirm-pass"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    placeholder="Re-enter password"
                    className={`pl-9 bg-zinc-900 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 ${
                      confirmPasswordTouched && confirmPasswordError ? "border-red-500 focus-visible:ring-red-500 animate-shake" : "border-zinc-800"
                    }`}
                  />
                </div>
                {confirmPasswordTouched && confirmPasswordError && (
                  <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                    <AlertCircle className="size-3" />
                    <span>{confirmPasswordError}</span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full font-semibold text-xs rounded-lg py-2.5 mt-2 cursor-pointer shadow-md transition-all ${
                  isFormValid 
                    ? "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-950/20" 
                    : "bg-zinc-800 hover:bg-zinc-800/80 border border-zinc-850 text-zinc-400"
                }`}
              >
                {loading ? <Loader2 className="size-4 animate-spin text-white mx-auto" /> : "Sign Up & Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="px-6 pb-6 border-t border-zinc-900/60 pt-4 flex justify-between text-xs text-zinc-400">
            <span>Already have an account?</span>
            <Link href="/sign-in" className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer">
              Sign In Instead
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
