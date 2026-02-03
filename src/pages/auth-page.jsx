import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
// Tabs and Card used inside `AuthForm`
import { Moon, Sun } from "lucide-react";
import { ForgotPasswordDialog } from "@/components/ui/forgot-password-dialog";
import AuthForm from "@/components/ui/auth-form";

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const [tabValue, setTabValue] = useState(
    () => localStorage.getItem("authTab") || "login",
  );
  const { user } = useAuth();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  // Persist tab value to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("authTab", tabValue);
  }, [tabValue]);

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

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // form logic moved into `AuthForm` component

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Animation variants for sliding effect (only on desktop)
  const formVariants = {
    login: { x: 0 },
    register: { x: isDesktop ? "100%" : 0 },
  };

  const imageVariants = {
    login: { x: 0 },
    register: { x: isDesktop ? "-100%" : 0 },
  };

  const transition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 lg:top-6 lg:right-6 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm hover:shadow transition-all"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
          ) : (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          )}
        </Button>
      </div>
      <div className="flex h-full relative">
        <motion.div
          className="flex flex-col items-center justify-center py-6 px-4 sm:py-8 sm:px-6 lg:py-6 lg:flex-none lg:px-8 xl:px-12 2xl:px-16 w-full lg:w-1/2 overflow-y-auto scrollbar-hide lg:absolute lg:inset-y-0 lg:left-0"
          initial={false}
          animate={tabValue}
          variants={formVariants}
          transition={transition}
          style={{ zIndex: tabValue === "register" ? 20 : 5 }}
        >
          <div className="w-full max-w-[360px] sm:max-w-sm md:max-w-md lg:max-w-[380px] xl:max-w-[420px] 2xl:max-w-md">
            {/* Mobile & Tablet Header - Always visible on mobile/tablet, hidden on lg, visible on xl+ */}
            {/* <div className="text-center mb-2 sm:mb-4 lg:hidden xl:block xl:mb-2">
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                <img
                  src="/Logo.png"
                  alt="TimeSync"
                  className="h-9 sm:h-10 lg:h-9 xl:h-10 2xl:h-11 w-auto"
                />
                <h2 className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                  Time
                  <span className="text-blue-600 dark:text-blue-400">Sync</span>
                </h2>
              </div>
              <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] lg:text-[10px] xl:text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Master your global schedule
              </p>
            </div> */}

            <AuthForm mode={tabValue} setMode={setTabValue} />
          </div>
        </motion.div>

        <motion.div
          className="hidden lg:flex relative w-1/2 justify-center overflow-hidden h-screen lg:absolute lg:inset-y-0 lg:right-0"
          initial={false}
          animate={tabValue}
          variants={imageVariants}
          transition={transition}
          style={{ zIndex: tabValue === "login" ? 10 : 5 }}
        >
          <div className="absolute inset-0 bg-slate-900">
            <div className="absolute inset-0 opacity-40 animate-gradient-x bg-gradient-to-br from-blue-600 via-indigo-900 to-slate-900"></div>
            {/* Animated Circles Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>
          </div>

          <div className="relative flex flex-col justify-center items-center h-full px-16 text-white z-10 text-center">
            <div className="max-w-xl mx-auto">
              {/* animated logo */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-4 rounded-2xl xl:rounded-3xl ">
                  <img
                    src="/Logo.png"
                    alt="TimeSync"
                    className="xl:h-16 h-10 w-auto animate-[spin_10s_linear_infinite]"
                  />
                </div>
                {/* <div className="rounded-2xl xl:rounded-3xl shadow-2xl">
                  <Briefcase className="xl:h-16 xl:w-10 text-indigo-400" />
                </div> */}
              </div>

              {/* tabs */}
              <div className="flex justify-center mb-6">
                <div className="relative w-56 bg-white/10 dark:bg-white/6 rounded-full p-1">
                  <div
                    aria-hidden
                    className={`absolute top-1/2 -translate-y-1/2 w-1/2 h-[38px] bg-white dark:bg-slate-900 rounded-full shadow transition-all ${tabValue === "login" ? "left-0" : "left-1/2"}`}
                    style={{ transition: "left .22s cubic-bezier(.2,.9,.2,1)" }}
                  />
                  <div className="relative z-10 grid grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setTabValue("login")}
                      className={`py-2 text-sm font-semibold rounded-full ${tabValue === "login" ? "text-slate-900 dark:text-white" : "text-slate-200"}`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setTabValue("register")}
                      className={`py-2 text-sm font-semibold rounded-full ${tabValue === "register" ? "text-slate-900 dark:text-white" : "text-slate-200"}`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
              <h2 className="text-5xl xl:text-6xl font-black mb-6 tracking-tighter leading-none">
                Work{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  anywhere
                </span>
                ,<br />
                Sync{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                  everywhere
                </span>
                .
              </h2>

              <p className="text-lg xl:text-xl text-slate-300 mb-10 font-medium leading-relaxed">
                Empower your remote team with seamless timezone management.
                Schedule meetings with confidence and maintain perfect harmony
                across the globe.
              </p>

              <div className="grid grid-cols-2 gap-6 justify-center mx-auto">
                <div className="p-4 xl:p-6 bg-white/5 backdrop-blur-sm hover:rotate-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="font-black text-2xl text-blue-400 mb-1">
                    3+
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Free Timezones
                  </div>
                </div>
                <div className="p-4 xl:p-6 bg-white/5 backdrop-blur-sm rounded-2xl hover:-rotate-3 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="font-black text-2xl text-indigo-400 mb-1">
                    100%
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Remote Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </div>
  );
}
