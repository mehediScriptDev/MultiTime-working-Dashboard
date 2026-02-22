import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth-service";

export function ResetPasswordDialog({ open, onOpenChange, token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      toast({
        title: "All fields required",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(token, password);

      toast({
        title: "Password reset successful!",
        description: response.message || "Please log in with your new password.",
      });

      setSuccess(true);

      // Close modal and reset state after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        setPassword("");
        setConfirmPassword("");
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      // Parse the error message for better UX
      let title = "Failed to reset password";
      let description = error.message || "The reset link may be invalid or expired.";

      // Customize title based on error type
      if (description.toLowerCase().includes("expired")) {
        title = "Link expired";
      } else if (
        description.toLowerCase().includes("invalid") ||
        description.toLowerCase().includes("not found")
      ) {
        title = "Invalid reset link";
      } else if (description.toLowerCase().includes("server")) {
        title = "Server error";
      } else if (description.toLowerCase().includes("password")) {
        title = "Password error";
      }

      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setSuccess(false);
      setPassword("");
      setConfirmPassword("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-11/12 bg-white dark:bg-slate-900 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-slate-400">
            Enter your new password below
          </DialogDescription>
        </DialogHeader>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="font-bold text-gray-600 dark:text-slate-400"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="font-bold text-gray-600 dark:text-slate-400"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-[#2563eb] text-white shadow-lg shadow-blue-600/20 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-base"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                Reset Password
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="w-full"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                You can now log in with your new password
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
