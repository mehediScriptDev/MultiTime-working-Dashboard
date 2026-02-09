import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Moon, Sun, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import LanguageSwitcher from "./LanguageSwitcher";
import { AccountModal } from "@/components/ui/account-modal";

export function Header() {
  const { user, subscription, logoutMutation, signOut } = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="bg-white dark:bg-gradient-to-r dark:from-[#0a0f1a] dark:via-[#0d1320] dark:to-[#0a0f1a] backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200 dark:border-[#1a2744]/60 shadow-sm dark:shadow-2xl dark:shadow-black/20">
      {/* Subtle gradient line accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-[68px] lg:h-[76px]">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link href="/" className="flex items-center min-w-0 group">
              <div className="relative flex-shrink-0">
                <img
                  src="/Logo.png"
                  alt="TimeSync"
                  className="h-8 sm:h-9 lg:h-10 w-auto transition-all duration-300 group-hover:scale-105 drop-shadow-lg"
                />
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 blur-xl transition-all duration-500" />
              </div>
              <span className="ml-1.5 text-xl sm:text-[22px] lg:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Time
                <span className="text-[#3558e8] dark:text-[#649cf4]">
                  Sync
                </span>
              </span>
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
            {/* Language Switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>

            {/* Glass separator */}
            <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-slate-500/30 to-transparent mx-2" />

            {/* Theme Toggle - Desktop only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex h-11 w-11 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-300"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
              ) : (
                <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-45" />
              )}
            </Button>

            {user ? (
              <>
                {/* Glass separator before user section - desktop only */}
                <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-slate-500/30 to-transparent mx-1" />

                {/* MOBILE: Avatar with dropdown menu */}
                <div className="sm:hidden relative" ref={mobileMenuRef}>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center gap-1 p-1 rounded-full hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white/10">
                      {user.username?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Mobile Dropdown Menu */}
                  {mobileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#0d1320] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50">
                      {/* Theme Toggle */}
                      <button
                        onClick={() => {
                          toggleTheme();
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 dark:text-white/90 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {theme === "light" ? (
                            <Moon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          ) : (
                            <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                          )}
                          <span>
                            {theme === "light" ? "Dark Mode" : "Light Mode"}
                          </span>
                        </div>
                      </button>
                      <div className="h-px bg-slate-200 dark:bg-white/10" />
                      {/* My Plan */}
                      <button
                        onClick={() => {
                          setAccountModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-white/90 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        My Plan
                      </button>
                      <div className="h-px bg-slate-200 dark:bg-white/10" />
                      {/* Log Out */}
                      <button
                        onClick={() => {
                          typeof signOut === "function"
                            ? signOut()
                            : logoutMutation.mutate();
                          setMobileMenuOpen(false);
                        }}
                        disabled={logoutMutation.isPending}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>

                {/* DESKTOP: Full user profile with avatar, name, plan */}
                <button
                  onClick={() => setAccountModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-base font-semibold ring-2 ring-slate-200 dark:ring-white/10 group-hover:ring-slate-300 dark:group-hover:ring-white/20 transition-all duration-300">
                    {user.username?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-slate-700 dark:text-white/90 group-hover:text-slate-900 dark:group-hover:text-white leading-tight truncate max-w-[120px] transition-colors duration-300">
                      {user.username || user.email?.split("@")[0]}
                    </span>
                    <span className="text-[11px] font-medium leading-tight text-left text-slate-500 dark:text-slate-400">
                      {user.isPremium || subscription?.plan === "premium"
                        ? "Premium"
                        : "Free"}
                    </span>
                  </div>
                </button>

                {/* DESKTOP: Sign Out Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    typeof signOut === "function"
                      ? signOut()
                      : logoutMutation.mutate()
                  }
                  disabled={logoutMutation.isPending}
                  className="hidden sm:flex px-2  text-slate-500 hover:text-red-400 bg-transparent hover:bg-red-500/10 border border-transparent hover:border-red-500/20 font-medium rounded-xl transition-all duration-300 group"
                >
                  <LogOut className="h-[20px] w-[20px] transition-transform duration-300 group-hover:-translate-x-0.5" />
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="h-10 sm:h-11 lg:h-11 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 rounded-full px-5 sm:px-6 lg:px-7 font-semibold text-sm tracking-wide transition-all duration-300 border border-white/10">
                  Get Started
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
