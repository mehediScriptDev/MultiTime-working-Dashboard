import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  Loader2,
  Mail,
  Lock,
  User,
  Globe,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ForgotPasswordDialog } from "@/components/ui/forgot-password-dialog";
import { OAuthButtons } from "@/components/ui/oauth-buttons";

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = (data) => {
    // Store remember me preference
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

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="h-screen overflow-hidden animate-gradient-x bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="flex h-full">
        <div className="flex flex-col justify-center px-4 py-6 sm:px-6 lg:flex-none lg:px-12 xl:px-16 w-full lg:w-1/2 overflow-y-auto">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center group">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 ring-4 ring-blue-500/10">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h2 className="ml-3 text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
                  Time
                  <span className="text-blue-600 dark:text-blue-400">Sync</span>
                </h2>
              </div>
              <p className="mt-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">
                Master your global schedule
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-5 bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
                <TabsTrigger
                  value="login"
                  className="rounded-lg font-bold text-gray-700 dark:text-slate-200"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg font-bold text-gray-700 dark:text-slate-200"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-2xl">
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Welcome back
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-slate-400">
                      Sign in to manage your global team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OAuthButtons />

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 font-medium">
                          Or continue with email
                        </span>
                      </div>
                    </div>

                    <Form {...loginForm}>
                      <form
                        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                        className="space-y-3"
                      >
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-sm text-gray-700 dark:text-slate-300">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input
                                    className="pl-11 h-10 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="your@email.com"
                                    type="email"
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
                                <FormLabel className="font-bold text-sm text-gray-700 dark:text-slate-300">
                                  Password
                                </FormLabel>
                                <Button
                                  type="button"
                                  variant="link"
                                  className="p-0 h-auto text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                  onClick={() => setForgotPasswordOpen(true)}
                                >
                                  Forgot?
                                </Button>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input
                                    className="pl-11 pr-11 h-10 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    type={
                                      showLoginPassword ? "text" : "password"
                                    }
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowLoginPassword(!showLoginPassword)
                                    }
                                    className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                        <div className="flex items-center space-x-2 pt-1">
                          <Checkbox
                            id="login-remember"
                            checked={rememberMe}
                            onCheckedChange={setRememberMe}
                            className="rounded"
                          />
                          <Label
                            htmlFor="login-remember"
                            className="text-xs font-medium text-gray-700 dark:text-slate-300 cursor-pointer"
                          >
                            Remember me for 30 days
                          </Label>
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30 rounded-xl font-bold text-base text-white transition-all"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Sign In
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-gray-100 dark:border-slate-800 mt-3 pt-4">
                    <p className="text-xs font-medium text-gray-700 dark:text-slate-300">
                      New to TimeSync?{" "}
                      <Button
                        variant="link"
                        className="p-0 font-bold text-blue-600 dark:text-blue-400"
                        onClick={() => {
                          const el = document.querySelector(
                            '[data-value="register"]',
                          );
                          if (el && typeof el.click === "function") el.click();
                        }}
                      >
                        Create account
                      </Button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-2xl max-h-screen overflow-y-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Get Started
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-slate-400">
                      Join the community of global professionals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OAuthButtons />

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 font-medium">
                          Or register with email
                        </span>
                      </div>
                    </div>

                    <Form {...registerForm}>
                      <form
                        onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                        className="space-y-3"
                      >
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-sm text-gray-700 dark:text-slate-300">
                                Username
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input
                                    className="pl-11 h-10 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="username"
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
                              <FormLabel className="font-bold text-sm text-gray-700 dark:text-slate-300">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input
                                    className="pl-11 h-10 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="your@email.com"
                                    type="email"
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
                              <FormLabel className="font-bold text-sm text-gray-700 dark:text-slate-300">
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input
                                    className="pl-11 pr-11 h-10 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    type={
                                      showRegisterPassword ? "text" : "password"
                                    }
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowRegisterPassword(
                                        !showRegisterPassword,
                                      )
                                    }
                                    className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                        {/* <div className="text-xs text-gray-600 dark:text-slate-400 bg-blue-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-blue-100 dark:border-slate-700">
                          <p className="font-semibold mb-1.5 text-blue-900 dark:text-blue-300">
                            Password Requirements:
                          </p>
                          <ul className="space-y-0.5">
                            <li
                              className={
                                registerForm.watch("password")?.length >= 6
                                  ? "text-green-600 dark:text-green-400 font-medium"
                                  : "text-gray-600 dark:text-slate-400"
                              }
                            >
                              ✓ At least 6 characters
                            </li>
                            <li className="text-gray-600 dark:text-slate-400">
                              • Mix of uppercase, lowercase, numbers
                              (recommended)
                            </li>
                          </ul>
                        </div> */}
                        <Button
                          type="submit"
                          className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30 rounded-xl font-bold text-base text-white transition-all"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Create Account
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-gray-100 dark:border-slate-800 mt-2 pt-3">
                    <p className="text-xs font-medium text-gray-700 dark:text-slate-300">
                      Already have an account?{" "}
                      <Button
                        variant="link"
                        className="p-0 font-bold text-blue-600 dark:text-blue-400"
                        onClick={() => {
                          const el = document.querySelector(
                            '[data-value="login"]',
                          );
                          if (el && typeof el.click === "function") el.click();
                        }}
                      >
                        Sign in
                      </Button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="hidden lg:flex relative w-0 flex-1 overflow-hidden h-screen">
          <div className="absolute inset-0 bg-slate-900">
            <div className="absolute inset-0 opacity-40 animate-gradient-x bg-gradient-to-br from-blue-600 via-indigo-900 to-slate-900"></div>
            {/* Animated Circles Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>
          </div>

          <div className="relative flex flex-col justify-center h-full px-16 text-white z-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                  <Globe className="h-12 w-12 text-blue-400 animate-[spin_10s_linear_infinite]" />
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                  <Briefcase className="h-12 w-12 text-indigo-400" />
                </div>
              </div>

              <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none">
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

              <p className="text-xl text-slate-300 mb-10 font-medium leading-relaxed">
                Empower your remote team with seamless timezone management.
                Schedule meetings with confidence and maintain perfect harmony
                across the globe.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="font-black text-2xl text-blue-400 mb-1">
                    3+
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Free Timezones
                  </div>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
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
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </div>
  );
}
