"use client";

import { useState } from "react";
import { User, Shield, AppWindow, KeyRound, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Both current and new passwords are required");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("Network error while updating password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Settings</h1>
        <p className="text-zinc-400 mt-2">Manage your account settings, application preferences, and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar Navigation inside Settings */}
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-zinc-900 text-zinc-100">
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50">
            <AppWindow className="mr-2 h-4 w-4" /> Application
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50">
            <Shield className="mr-2 h-4 w-4" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </Button>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Settings */}
          <Card className="bg-zinc-950/50 border-zinc-900 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-zinc-100">User Profile</CardTitle>
              <CardDescription className="text-zinc-500">Update your public profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                <Input id="name" defaultValue={user?.firstName ? `${user.firstName} ${user.lastName}` : ""} className="bg-zinc-900 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                <Input id="email" defaultValue={user?.primaryEmailAddress?.emailAddress} disabled className="bg-zinc-900 border-zinc-800 text-zinc-500 opacity-50" />
                <p className="text-xs text-zinc-500">Email cannot be changed through this panel.</p>
              </div>
              <Button className="bg-violet-600 hover:bg-violet-500 text-white">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Password Reset */}
          <Card className="bg-zinc-950/50 border-zinc-900 backdrop-blur-xl border-red-900/20">
            <CardHeader>
              <CardTitle className="text-zinc-100 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-red-400" />
                Change Password
              </CardTitle>
              <CardDescription className="text-zinc-500">
                You must enter your current password to set a new one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-zinc-300">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-zinc-300">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isUpdatingPassword || !currentPassword || !newPassword}
                  className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 mt-2"
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
