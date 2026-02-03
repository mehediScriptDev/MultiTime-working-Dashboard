import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OAuthButtons } from "@/components/ui/oauth-buttons";

export default function AuthForm({
  initialMode = "login",
  mode: controlledMode,
  setMode: setControlledMode,
}) {
  const { user, loginMutation, registerMutation } = useAuth();
  const [internalMode, setInternalMode] = useState(initialMode); // fallback when uncontrolled
  const mode = controlledMode ?? internalMode; // active mode
  const setMode = setControlledMode ?? setInternalMode;
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Forms keep existing validation logic
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onLoginSubmit = (data) => {
    if (rememberMe) {
      localStorage.setItem(
        "rememberMe",
        JSON.stringify({ email: data.email, timestamp: Date.now() }),
      );
    }
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-4 lg:py-3 xl:py-4">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-visible bg-white dark:bg-slate-900 w-full">
          <CardHeader className="relative pt-5 sm:pt-6 lg:pt-5 xl:pt-6 2xl:pt-8 px-5 sm:px-6 lg:px-5 xl:px-6 2xl:px-8 pb-3 sm:pb-4 lg:pb-3 xl:pb-4 2xl:pb-6">
            {/* Tabs/segmented control moved to the right-side panel; header kept minimal */}

            <CardTitle className="text-xl sm:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-1.5 lg:mb-1 xl:mb-2">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base text-slate-600 dark:text-slate-400">
              {mode === "login"
                ? "Enter your credentials to access your account."
                : "Start your free account — join global teams in seconds."}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 sm:px-6 lg:px-5 xl:px-6 2xl:px-8 pb-3 sm:pb-4 lg:pb-3 xl:pb-4 2xl:pb-6">
            {mode === "login" ? (
              <Form key="login-form" {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-3 sm:space-y-4 lg:space-y-3 xl:space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                            <Input
                              placeholder="write your email"
                              type="email"
                              className="pl-10 h-10 sm:h-11 lg:h-10 xl:h-11 2xl:h-12 rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm bg-transparent"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Password
                          </FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                            <Input
                              placeholder="••••••••"
                              type={showLoginPassword ? "text" : "password"}
                              className="pl-10 pr-10 h-10 sm:h-11 lg:h-10 xl:h-11 2xl:h-12 rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm bg-transparent"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowLoginPassword(!showLoginPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 z-10"
                              aria-label={
                                showLoginPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showLoginPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                        id="auth-remember"
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor="auth-remember"
                        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                      >
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full h-10 sm:h-11 lg:h-10 xl:h-11 2xl:h-12 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                      ) : null}
                      Sign In
                    </Button>
                  </div>

                  <div className="relative my-1 sm:my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <OAuthButtons />
                </form>
              </Form>
            ) : (
              <Form key="register-form" {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="space-y-3 sm:space-y-4 lg:space-y-3 xl:space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Username
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                            <Input
                              placeholder="username"
                              className="pl-10 h-10 sm:h-11 lg:h-10 xl:h-11 2xl:h-12 rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm bg-transparent"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                            <Input
                              placeholder="write your email"
                              type="email"
                              className="pl-10 h-10 sm:h-11 lg:h-10 xl:h-11 2xl:h-12 rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm bg-transparent"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                            <Input
                              placeholder="••••••••"
                              type={showRegisterPassword ? "text" : "password"}
                              className="pl-10 pr-10 h-10 sm:h-11 lg:h-10 xl:h-11 2xl:h-12 rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm bg-transparent"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowRegisterPassword(!showRegisterPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 z-10"
                              aria-label={
                                showRegisterPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showRegisterPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Button
                      type="submit"
                      className="w-full h-10 sm:h-11 lg:h-10 xl:h-11 2xl:h-12 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                      ) : null}
                      Create account
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="px-5 sm:px-6 lg:px-5 xl:px-6 2xl:px-8 pb-5 sm:pb-6 lg:pb-5 xl:pb-6 2xl:pb-8 pt-3 sm:pt-4 lg:pt-3 xl:pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {mode === "login" ? (
                <>
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-blue-600 dark:text-blue-400"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-blue-600 dark:text-blue-400"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
