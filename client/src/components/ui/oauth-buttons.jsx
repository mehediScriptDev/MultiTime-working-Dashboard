import { Button } from "@/components/ui/button";
import { Chrome, Facebook } from "lucide-react";

export function OAuthButtons() {
  const handleGoogleLogin = () => {
    // OAuth integration - backend will handle actual Google authentication
    window.location.href = "/api/auth/google";
  };

  const handleFacebookLogin = () => {
    // OAuth integration - backend will handle actual Facebook authentication
    window.location.href = "/api/auth/facebook";
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        className="w-full h-12 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 rounded-xl font-bold text-base hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        onClick={handleGoogleLogin}
      >
        <Chrome className="mr-3 h-5 w-5 text-red-500" />
        Continue with Google
      </Button>
      <Button
        type="button"
        className="w-full h-12 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 rounded-xl font-bold text-base hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        onClick={handleFacebookLogin}
      >
        <Facebook className="mr-3 h-5 w-5 text-blue-600" />
        Continue with Facebook
      </Button>
    </div>
  );
}
