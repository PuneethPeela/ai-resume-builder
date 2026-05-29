"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, KeyRound, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userRole?: string;
}

export function SettingsModal({ isOpen, onClose, userEmail, userRole }: SettingsModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Touched state tracking for real-time validation error cues
  const [oldPasswordTouched, setOldPasswordTouched] = useState(false);
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Real-time constraints check
  const oldPasswordError = !oldPassword.trim() ? "Current password is required" : "";
  
  const newPasswordError = !newPassword 
    ? "New password is required" 
    : newPassword.length < 6 
      ? "New password must be at least 6 characters" 
      : oldPassword && newPassword === oldPassword
        ? "New password cannot be same as old password"
        : "";

  const confirmPasswordError = !confirmPassword 
    ? "Please confirm your new password" 
    : confirmPassword !== newPassword 
      ? "Passwords are not same" 
      : "";

  const isFormValid = !oldPasswordError && !newPasswordError && !confirmPasswordError;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setOldPasswordTouched(true);
    setNewPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (oldPasswordError) {
      toast.error(`Reset Failed: ${oldPasswordError}!`);
      return;
    }
    if (newPasswordError) {
      toast.error(`Reset Failed: ${newPasswordError}!`);
      return;
    }
    if (confirmPasswordError) {
      toast.error(`Reset Failed: ${confirmPasswordError}!`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Security password reset successful!");
        // Clear all fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Reset touched states
        setOldPasswordTouched(false);
        setNewPasswordTouched(false);
        setConfirmPasswordTouched(false);
        onClose();
      } else {
        toast.error(result.error || "Password reset verification failed");
      }
    } catch (err) {
      toast.error("Network error resetting password credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass border-zinc-850 shadow-2xl max-w-md w-full bg-zinc-950/95 text-zinc-100 font-sans p-6 rounded-2xl isolate">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-zinc-50 font-bold text-base flex items-center gap-2">
            <KeyRound className="size-4.5 text-violet-400" />
            <span>Profile settings & security</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Manage your account security credentials and reset password.
          </DialogDescription>
        </DialogHeader>

        {/* User Info / Role Badge */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 flex items-center justify-between mt-2 select-none">
          <div className="space-y-0.5">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Account Active Session</p>
            <p className="text-xs text-zinc-300 font-medium truncate max-w-[200px]">{userEmail || "loading email..."}</p>
          </div>
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border tracking-wider select-none ${
            userRole === "admin" 
              ? "bg-violet-950/30 border-violet-800 text-violet-400" 
              : userRole === "sub_admin"
                ? "bg-amber-950/30 border-amber-800 text-amber-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-400"
          }`}>
            {userRole || "User"}
          </span>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4 pt-3">
          {/* Current Password */}
          <div className="space-y-1.5">
            <Label htmlFor="curr-pass" className="text-xs text-zinc-300 font-semibold flex items-center justify-between">
              <span>Current Password</span>
              {oldPassword.trim().length > 0 && !oldPasswordError && <CheckCircle className="size-3.5 text-emerald-400" />}
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
              <Input
                id="curr-pass"
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                onBlur={() => setOldPasswordTouched(true)}
                placeholder="Enter current password"
                className={`pl-9 bg-zinc-900 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 ${
                  oldPasswordTouched && oldPasswordError ? "border-red-500 focus-visible:ring-red-500 animate-shake" : "border-zinc-800"
                }`}
              />
            </div>
            {oldPasswordTouched && oldPasswordError && (
              <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                <AlertCircle className="size-3" />
                <span>{oldPasswordError}</span>
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-xs text-zinc-300 font-semibold flex items-center justify-between">
              <span>New Password</span>
              {newPassword.length >= 6 && !newPasswordError && <CheckCircle className="size-3.5 text-emerald-400" />}
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
              <Input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => setNewPasswordTouched(true)}
                placeholder="At least 6 characters"
                className={`pl-9 bg-zinc-900 text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 ${
                  newPasswordTouched && newPasswordError ? "border-red-500 focus-visible:ring-red-500 animate-shake" : "border-zinc-800"
                }`}
              />
            </div>
            {newPasswordTouched && newPasswordError && (
              <p className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1 animate-in fade-in duration-150">
                <AlertCircle className="size-3" />
                <span>{newPasswordError}</span>
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-new-pass" className="text-xs text-zinc-300 font-semibold flex items-center justify-between">
              <span>Confirm New Password</span>
              {confirmPassword.length > 0 && !confirmPasswordError && <CheckCircle className="size-3.5 text-emerald-400" />}
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 size-4 text-zinc-500" />
              <Input
                id="confirm-new-pass"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmPasswordTouched(true)}
                placeholder="Re-enter new password"
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

          <DialogFooter className="flex gap-2 sm:gap-0 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs text-zinc-400 border-zinc-900 hover:bg-zinc-900 hover:text-white cursor-pointer rounded-lg px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`text-xs font-semibold rounded-lg px-4 cursor-pointer shadow-md transition-all ${
                isFormValid 
                  ? "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-950/20" 
                  : "bg-zinc-800 hover:bg-zinc-800/80 border border-zinc-850 text-zinc-400"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save New Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
