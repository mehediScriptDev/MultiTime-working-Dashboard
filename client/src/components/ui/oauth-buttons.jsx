import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Facebook } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";

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
    <div className="space-y-2.5">
      <Button
        type="button"
        className="w-full h-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        onClick={handleGoogleLogin}
      >
        <FcGoogle className="mr-2.5 h-4 w-4" />
        Continue with Google
      </Button>
      <Button
        type="button"
        className="w-full h-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        onClick={handleFacebookLogin}
      >
        <FaFacebookF className="mr-2.5 h-4 w-4 text-[#1873eb]" />
        Continue with Facebook
      </Button>
    </div>
  );
}
