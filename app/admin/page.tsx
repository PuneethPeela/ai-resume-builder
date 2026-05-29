"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, User, UserPlus, Trash2, ArrowLeft, Check, X, ShieldAlert, KeyRound } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  promotionRequested: boolean;
  promotionRole: string | null;
  clerkId: string;
  createdAt: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form states for creating a new user
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [showAddForm, setShowAddForm] = useState(false);

  // Check auth & fetch user list
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const meRes = await fetch("/api/auth/me");
        const meResult = await meRes.json();
        
        if (!meResult.success || (meResult.data.role !== "admin" && meResult.data.role !== "sub_admin")) {
          toast.error("Forbidden: Administrative credentials required.");
          router.push("/dashboard");
          return;
        }

        setCurrentUser(meResult.data);

        const usersRes = await fetch("/api/admin/users");
        const usersResult = await usersRes.json();
        if (usersResult.success) {
          setUsers(usersResult.data);
        } else {
          toast.error(usersResult.error || "Failed to load database users");
        }
      } catch (err) {
        console.error("Admin Auth Error:", err);
        toast.error("Error loading console");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  const handleRoleChange = async (userId: string, targetRole: string) => {
    if (currentUser?.role === "sub_admin") {
      toast.error("Access Denied: Sub-Admins cannot edit user accounts.");
      return;
    }

    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: targetRole }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("User role updated successfully");
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
        );
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch (err) {
      toast.error("Network error modifying role");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePromotionAction = async (userId: string, action: "approve" | "reject", promotionRole: string | null) => {
    if (currentUser?.role === "sub_admin") {
      toast.error("Access Denied: Sub-Admins cannot approve/reject promotions.");
      return;
    }

    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: action === "approve" ? "approve_promotion" : "reject_promotion",
          promotionRole,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(action === "approve" ? "Promotion approved!" : "Promotion request rejected");
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  role: action === "approve" ? (promotionRole || u.role) : u.role,
                  promotionRequested: false,
                  promotionRole: null,
                }
              : u
          )
        );
      } else {
        toast.error(result.error || "Action failed");
      }
    } catch (err) {
      toast.error("Network error updating promotion status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (currentUser?.role === "sub_admin") {
      toast.error("Access Denied: Sub-Admins cannot delete user accounts.");
      return;
    }

    if (!confirm("Are you sure you want to permanently delete this user?")) return;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        toast.error(result.error || "Deletion failed");
      }
    } catch (err) {
      toast.error("Network error deleting user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role === "sub_admin") {
      toast.error("Access Denied: Sub-Admins cannot manually create users.");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          name: newUserName,
          password: newUserPassword || "user123",
          role: newUserRole,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("User created successfully!");
        setUsers((prev) => [result.data, ...prev]);
        setNewUserEmail("");
        setNewUserName("");
        setNewUserPassword("");
        setShowAddForm(false);
      } else {
        toast.error(result.error || "Failed to create user");
      }
    } catch (err) {
      toast.error("Network error creating user");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-950 text-zinc-100 gap-4 font-sans">
        <Loader2 className="size-8 animate-spin text-violet-500" />
        <p className="text-sm text-zinc-400 font-medium">Validating administrative access...</p>
      </div>
    );
  }

  const isSubAdmin = currentUser?.role === "sub_admin";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-150 p-6 md:p-12 font-sans selection:bg-violet-600/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 select-none">
              <Shield className="size-6 text-violet-400" />
              <h1 className="text-2xl font-bold tracking-tight text-white">Administrative Console</h1>
            </div>
            <p className="text-xs text-zinc-500">
              Welcome back, <span className="text-violet-400 font-bold">{currentUser?.name}</span> • 
              Role: <span className="font-semibold text-zinc-300 uppercase">{currentUser?.role}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" passHref>
              <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs">
                <ArrowLeft className="size-3.5 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
            {!isSubAdmin && (
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-lg gap-1.5"
              >
                <UserPlus className="size-3.5" />
                Add User
              </Button>
            )}
          </div>
        </div>

        {/* Sub-Admin Read Only Banner Warning */}
        {isSubAdmin && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 max-w-3xl">
            <ShieldAlert className="size-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Sub-Admin Read-Only Active</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                As a Sub-Admin, you are granted complete visibility to view the user registry, track logs, and verify registration details. However, user deletion, manual creation, role overrides, and system settings modifications are disabled.
              </p>
            </div>
          </div>
        )}

        {/* Manual User Creation Form (Admin Only) */}
        {showAddForm && !isSubAdmin && (
          <Card className="glass border-zinc-900 bg-zinc-950/40 backdrop-blur-xl max-w-2xl">
            <CardHeader className="p-5">
              <CardTitle className="text-sm font-bold text-zinc-200">Manually Provision User Profile</CardTitle>
              <CardDescription className="text-xs text-zinc-500">Create standard credentials immediately active in local bypass modes.</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="create-name" className="text-xs text-zinc-400">Full Name</Label>
                    <Input 
                      id="create-name"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Arjun Sharma"
                      className="bg-zinc-900 border-zinc-800 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="create-email" className="text-xs text-zinc-400">Email Address</Label>
                    <Input 
                      id="create-email"
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="arjun@example.com"
                      className="bg-zinc-900 border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="create-password" className="text-xs text-zinc-400">Password</Label>
                    <Input 
                      id="create-password"
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Leave blank for 'user123'"
                      className="bg-zinc-900 border-zinc-800 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="create-role" className="text-xs text-zinc-400">Default Access Role</Label>
                    <select
                      id="create-role"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    >
                      <option value="user">User (Standard Candidate)</option>
                      <option value="sub_admin">Sub-Admin (Read-Only Console)</option>
                      <option value="admin">Admin (Full Control)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setShowAddForm(false)}
                    className="text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-lg"
                  >
                    Create User Record
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* User Registry List */}
        <Card className="glass border-zinc-900 bg-zinc-950/30 backdrop-blur-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-base font-bold text-zinc-200">Registered Accounts ({users.length})</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Live database rows matching credentials and Clerk metadata.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-t border-zinc-900">
            {users.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500 bg-zinc-900/10">
                      <th className="py-3.5 px-6 font-bold">User Details</th>
                      <th className="py-3.5 px-4 font-bold">System ID</th>
                      <th className="py-3.5 px-4 font-bold">Current Access Role</th>
                      <th className="py-3.5 px-4 font-bold">Promotion Demands</th>
                      <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60 text-xs">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-900/10 transition-colors">
                        {/* Name and Email */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 shadow-sm">
                              <User className="size-4 text-violet-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-200">{u.name || "Unnamed Reviewer"}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* ID Keys */}
                        <td className="py-4 px-4 font-mono text-[10px] text-zinc-500 max-w-xs truncate">
                          {u.clerkId}
                        </td>

                        {/* Current Role Badge */}
                        <td className="py-4 px-4">
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] uppercase tracking-wider font-semibold py-0.5 px-2 ${
                              u.role === "admin" 
                                ? "bg-violet-950/20 text-violet-400 border-violet-800/30" 
                                : u.role === "sub_admin"
                                ? "bg-amber-950/20 text-amber-400 border-amber-800/30"
                                : "bg-zinc-900/40 text-zinc-400 border-zinc-800/50"
                            }`}
                          >
                            {u.role === "sub_admin" ? "Sub-Admin" : u.role}
                          </Badge>
                        </td>

                        {/* Promotion Demands */}
                        <td className="py-4 px-4">
                          {u.promotionRequested ? (
                            <div className="flex flex-col gap-1 max-w-[200px]">
                              <p className="text-[10px] text-amber-400 font-medium">
                                Requests <Badge variant="outline" className="text-[8px] bg-amber-500/10 border-amber-500/20 py-0 text-amber-300 font-semibold">{u.promotionRole === "sub_admin" ? "Sub-Admin" : u.promotionRole}</Badge>
                              </p>
                              {!isSubAdmin && (
                                <div className="flex gap-1.5 mt-1">
                                  <Button
                                    onClick={() => handlePromotionAction(u.id, "approve", u.promotionRole)}
                                    size="xs"
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white size-5 p-0 rounded-md"
                                    disabled={actionLoading === u.id}
                                  >
                                    <Check className="size-3" />
                                  </Button>
                                  <Button
                                    onClick={() => handlePromotionAction(u.id, "reject", null)}
                                    size="xs"
                                    className="bg-red-600 hover:bg-red-500 text-white size-5 p-0 rounded-md"
                                    disabled={actionLoading === u.id}
                                  >
                                    <X className="size-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-zinc-500">None</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* Role management selectors (Admin only) */}
                            {!isSubAdmin && u.id !== currentUser.id && (
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                disabled={actionLoading === u.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-md py-1 px-2 text-[10px] text-zinc-300 focus:outline-none"
                              >
                                <option value="user">User</option>
                                <option value="sub_admin">Sub-Admin</option>
                                <option value="admin">Admin</option>
                              </select>
                            )}

                            {/* Deletions (Admin only) */}
                            {!isSubAdmin && u.id !== currentUser.id ? (
                              <Button
                                onClick={() => handleDeleteUser(u.id)}
                                variant="ghost"
                                size="xs"
                                className="text-zinc-500 hover:text-red-400 p-1 hover:bg-red-500/10 border-0"
                                disabled={actionLoading === u.id}
                              >
                                {actionLoading === u.id ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="size-3.5" />
                                )}
                              </Button>
                            ) : u.id === currentUser.id ? (
                              <span className="text-[10px] text-violet-400 font-semibold px-2">You</span>
                            ) : (
                              <span className="text-[10px] text-zinc-600">Restricted</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
