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
    <div className="gap-2 flex items-center ">
      <Button
        type="button"
        className="w-full h-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        onClick={handleGoogleLogin}
      >
        <FcGoogle className="mr-1 sm:mr-2.5 h-4 w-3"/>
        Google
      </Button>
      <Button
        type="button"
        className="w-full h-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        onClick={handleFacebookLogin}
      >
        <FaFacebookF className="mr-1 sm:mr-2.5 h-4 w-3 text-[#1873eb]" />
        Facebook
      </Button>
    </div>
  );
}
