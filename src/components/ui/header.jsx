import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, User, Zap, Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import LanguageSwitcher from "./LanguageSwitcher";
import { AccountModal } from "@/components/ui/account-modal";

export function Header() {
  const { user, subscription, logoutMutation, signOut } = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/Logo.png" alt="TimeSync" className="h-10 w-auto" />
              <span className="lg:ml-2 ml-1 md:text-2xl text-xl font-black tracking-tighter text-gray-900 dark:text-white">
                Time
                <span className="text-blue-600 dark:text-blue-400">Sync</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center -space-x-1 sm:space-x-3 lg:space-x-4">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountOpen(true)}
                  className="hidden md:flex items-center px-4 py-2 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-3 shadow-md">
                    {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-none">
                      {user.username || user.email?.split("@")[0]}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                        user.isPremium || subscription?.plan === "premium"
                          ? "text-gray-400 dark:text-slate-500"
                          : "text-gray-400 dark:text-slate-500"
                      }`}
                    >
                      {user.isPremium || subscription?.plan === "premium" ? "Premium" : "Free Plan"}
                    </span>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    typeof signOut === "function"
                      ? signOut()
                      : logoutMutation.mutate()
                  }
                  disabled={logoutMutation.isPending}
                  className="text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-xl"
                >
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Sign out</span>
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-600/20 rounded-xl px-6 font-bold">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          <AccountModal open={accountOpen} onOpenChange={setAccountOpen} />
        </div>
      </div>
    </header>
  );
}
