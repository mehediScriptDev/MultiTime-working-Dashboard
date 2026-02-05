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
  const [accountModalOpen, setAccountModalOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          <div className="flex items-center min-w-0">
            <Link href="/" className="flex items-center min-w-0">
              <img
                src="/Logo.png"
                alt="TimeSync"
                className="h-7 sm:h-8 lg:h-10 w-auto flex-shrink-0"
              />
              <span className="ml-1 sm:ml-1.5 lg:ml-2 text-base sm:text-xl md:text-2xl font-black tracking-tighter text-gray-900 dark:text-white whitespace-nowrap">
                Time
                <span className="text-blue-600 dark:text-blue-400">Sync</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg sm:rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            {user ? (
              <>
                <button
                  onClick={() => setAccountModalOpen(true)}
                  className="flex items-center sm:px-3 lg:px-4 sm:py-2 sm:bg-gray-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl sm:border border-gray-100 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0">
                    {user.username?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                  <div className="hidden md:flex flex-col ml-2 lg:ml-3 min-w-0">
                    <span className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-none truncate">
                      {user.username || user.email?.split("@")[0]}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                        user.isPremium || subscription?.plan === "premium"
                          ? "text-blue-500"
                          : "text-gray-400 dark:text-slate-500"
                      }`}
                    >
                      {user.isPremium || subscription?.plan === "premium"
                        ? "Premium"
                        : "Free"}
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
                  className="h-8 sm:h-9 px-2 sm:px-3 text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-lg sm:rounded-xl"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:mr-2" />
                  <span className="hidden md:inline text-xs sm:text-sm">
                    Sign out
                  </span>
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="h-8 sm:h-9 lg:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-600/20 rounded-lg sm:rounded-xl px-3 sm:px-4 lg:px-6 font-bold text-xs sm:text-sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Account Modal */}
      <AccountModal
        open={accountModalOpen}
        onOpenChange={setAccountModalOpen}
      />
    </header>
  );
}
