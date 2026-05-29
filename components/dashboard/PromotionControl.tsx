"use client";

import { useEffect, useState } from "react";
import { Shield, ShieldAlert, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  clerkId: string;
  promotionRequested: boolean;
  promotionRole: string | null;
}

export function PromotionControl() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const result = await res.json();
      if (result.success) {
        setProfile(result.data);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRequestPromotion = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/auth/request-promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedRole: "sub_admin" }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Request submitted successfully!");
        setDialogOpen(false);
        fetchProfile();
      } else {
        toast.error(result.error || "Failed to submit request");
      }
    } catch (err) {
      toast.error("Network error submitting request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDemote = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/auth/request-promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedRole: "user" }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || "Successfully returned to standard user!");
        fetchProfile();
      } else {
        toast.error(result.error || "Failed to demote");
      }
    } catch (err) {
      toast.error("Network error executing demotion");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 border border-zinc-900 bg-zinc-950/20 rounded-2xl h-16 animate-pulse">
        <Loader2 className="size-4 animate-spin text-zinc-600 mr-2" />
        <span className="text-xs text-zinc-500 font-medium">Checking credentials...</span>
      </div>
    );
  }

  if (!profile) return null;

  const isUser = profile.role === "user";
  const isSubAdmin = profile.role === "sub_admin";
  const isAdmin = profile.role === "admin";

  return (
    <Card className="border border-zinc-905 bg-zinc-950/20 backdrop-blur-md overflow-hidden relative group">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-48 h-full bg-violet-600/5 blur-2xl pointer-events-none rounded-full" />
      <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        
        {/* Status display */}
        <div className="flex items-start md:items-center gap-3">
          <div className="size-10 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 shadow-sm">
            {isAdmin ? (
              <ShieldAlert className="size-5 text-violet-400 animate-pulse" />
            ) : isSubAdmin ? (
              <ShieldCheck className="size-5 text-emerald-400" />
            ) : (
              <Shield className="size-5 text-zinc-500" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-zinc-200">System Authorization</span>
              <Badge 
                variant="outline" 
                className={`text-[9px] uppercase tracking-wider font-semibold py-0 px-1.5 ${
                  isAdmin 
                    ? "bg-violet-950/30 text-violet-400 border-violet-800/40" 
                    : isSubAdmin
                    ? "bg-emerald-950/30 text-emerald-400 border-emerald-800/40"
                    : "bg-zinc-900/40 text-zinc-400 border-zinc-800/50"
                }`}
              >
                {isSubAdmin ? "Sub-Admin" : profile.role}
              </Badge>
              {profile.promotionRequested && (
                <Badge variant="outline" className="text-[9px] bg-amber-500/10 border-amber-500/20 text-amber-300 font-semibold py-0">
                  Pending Promotion Request
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xl">
              {isAdmin 
                ? "You have full administrative privileges. You can provision users, override roles, grant sub-admin elevations, and manage the full database registry."
                : isSubAdmin
                ? "You are a Sub-Admin. You have read-only visibility into the registry, metrics, and user logs. To run standard candidate scenarios, you can demote yourself anytime."
                : profile.promotionRequested
                ? `You have requested elevation to Sub-Admin. Standard promotion requests must be reviewed and approved by an Administrator in the system registry console.`
                : "Standard candidate account. To view user listings, check audit queues, and monitor logs, you can request promotional elevation to a Sub-Admin role."}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Admin link */}
          {(isAdmin || isSubAdmin) && (
            <Link href="/admin" passHref>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-zinc-800 hover:bg-zinc-900 text-zinc-200 text-xs font-medium rounded-lg gap-1.5 h-8 animate-pulse hover:animate-none"
              >
                <span>Secret Console</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          )}

          {/* User demotes itself if sub_admin or admin */}
          {(isSubAdmin || isAdmin) && (
            <Button
              onClick={handleDemote}
              variant="ghost"
              size="sm"
              className="text-zinc-500 hover:text-red-400 hover:bg-red-500/5 border-0 text-xs font-medium h-8"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="size-3 animate-spin mr-1" />
              ) : (
                "Demote to User"
              )}
            </Button>
          )}

          {/* Standard user requesting promotion */}
          {isUser && !profile.promotionRequested && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger
                render={
                  <Button 
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-lg h-8 gap-1"
                  />
                }
              >
                <Shield className="size-3.5" />
                Request Sub-Admin Role
              </DialogTrigger>
              <DialogContent className="glass border-zinc-900 bg-zinc-950/90 backdrop-blur-2xl text-zinc-150 font-sans max-w-sm">
                <DialogHeader className="space-y-2">
                  <div className="size-10 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto mb-2">
                    <Shield className="size-5" />
                  </div>
                  <DialogTitle className="text-center font-bold text-base text-zinc-100">
                    Request Promotion
                  </DialogTitle>
                  <DialogDescription className="text-center text-xs text-zinc-500">
                    Are you sure you want to request promotion to <span className="font-semibold text-zinc-300">Sub-Admin</span>?
                  </DialogDescription>
                </DialogHeader>

                <div className="py-2 text-[11px] text-zinc-400 leading-relaxed text-center">
                  This sends a formal access request to the system registry. Administrators can approve your access in the administrative console.
                </div>

                <DialogFooter className="sm:justify-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setDialogOpen(false)}
                    className="text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRequestPromotion}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-lg gap-1.5 px-4"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <span>Submit Request</span>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Pending state */}
          {isUser && profile.promotionRequested && (
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-800/80 bg-zinc-900/20 text-zinc-500 text-xs font-medium rounded-lg h-8 cursor-not-allowed"
              disabled
            >
              Request Submitted
            </Button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
