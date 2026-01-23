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
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ForgotPasswordDialog({ open, onOpenChange }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - backend will handle actual email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Email sent!",
        description: "Check your inbox for password reset instructions.",
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setSubmitted(false);
      setEmail("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-slate-400">
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="font-bold text-gray-600 dark:text-slate-400">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-600/20 rounded-xl font-bold text-lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Send Reset Link
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
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Check your email
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                We've sent a password reset link to <br />
                <span className="font-semibold">{email}</span>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
