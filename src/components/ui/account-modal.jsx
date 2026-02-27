import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { subscriptionService } from "@/lib/subscription-service";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Crown,
  Calendar,
  CreditCard,
  Zap,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function AccountModal({ open, onOpenChange }) {
  const { user, subscription, upgradeMutation } = useAuth();
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [timezonesCount, setTimezonesCount] = useState(0);

  const isPremium = user?.isPremium || subscription?.plan === "premium";

  // Get actual timezone count from localStorage
  useEffect(() => {
    const getTimezonesCount = () => {
      try {
        const saved = localStorage.getItem("timezones_v1");
        if (saved) {
          const timezones = JSON.parse(saved);
          setTimezonesCount(Array.isArray(timezones) ? timezones.length : 0);
        } else {
          setTimezonesCount(0);
        }
      } catch (error) {
        console.error("Failed to get timezones count:", error);
        setTimezonesCount(0);
      }
    };

    // Get count initially and when modal opens
    if (open) {
      getTimezonesCount();
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      getTimezonesCount();
    };

    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener("timezonesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("timezonesUpdated", handleStorageChange);
    };
  }, [open]);

  const handleUpgrade = () => {
    const returnUrl = `${window.location.origin}/subscription/success?upgrade=success`;
    const cancelUrl = `${window.location.origin}/subscription/cancel`;
    upgradeMutation.mutate({ returnUrl, cancelUrl });
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await subscriptionService.cancel(token);

      if (response?.success) {
        toast({
          title: "Subscription cancelled",
          description:
            "Your premium subscription has been cancelled. You'll have access until the end of your billing period.",
        });
        setCancelDialogOpen(false);
        onOpenChange(false);
        // Refresh page to update UI
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast({
          title: "Cancellation failed",
          description: response?.message || "Unable to cancel subscription",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] w-11/12 mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {isPremium ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <div className="text-white text-xl font-bold">
                    {user?.username?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                </div>
              )}
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.username || user?.email?.split("@")[0] || "Account"}
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400">
                  {user?.email}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Plan Status */}
            <div
              className={`p-4 rounded-xl border ${
                isPremium
                  ? "bg-slate-900/60 dark:bg-slate-900/60 border-slate-700"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Current Plan
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    isPremium
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isPremium ? "Premium" : "Free Plan"}
                </span>
              </div>

              {isPremium ? (
                <div className="space-y-3">
                  {/* Features */}
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-400 dark:text-blue-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Unlimited Timezones
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Add as many timezones as you need
                      </p>
                    </div>
                  </div>

                  {/* Subscription Details */}
                  {subscription?.currentPeriodEnd && (
                    <div className="flex items-start gap-2 pt-2 border-t border-yellow-200 dark:border-yellow-800">
                      <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Active Until
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {formatDate(subscription.currentPeriodEnd)}
                        </p>
                      </div>
                    </div>
                  )}

                  {subscription?.status && (
                    <div className="flex items-start gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Status
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium capitalize">
                          {subscription.status}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Free Plan Limits */}
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Limited to 3 Timezones
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Upgrade to add unlimited timezones
                      </p>
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Timezones Used
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {timezonesCount} / 3
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                        style={{
                          width: `${Math.min((timezonesCount / 3) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Info for Free Users */}
            {!isPremium && subscription?.pricing && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Unlock Premium Features
                  </span>
                </div>
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">
                  ${subscription.pricing.amount / 100}
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                    /{subscription.pricing.interval}
                  </span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {subscription.pricing.currency?.toUpperCase()} • Cancel
                  anytime
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            {isPremium ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setCancelDialogOpen(true)}
                  className="flex-1"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Cancel Subscription
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={handleUpgrade}
                  disabled={upgradeMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white shadow-lg"
                >
                  {upgradeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Premium
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Cancel Premium Subscription?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              Are you sure you want to cancel your premium subscription? You
              will:
              <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                <li>Lose access to unlimited timezones</li>
                <li>
                  Be limited to 3 timezones after your billing period ends
                </li>
                <li>
                  Keep access until {formatDate(subscription?.currentPeriodEnd)}
                </li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>
              Keep Premium
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={isCanceling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Canceling...
                </>
              ) : (
                "Yes, Cancel Subscription"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
