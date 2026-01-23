import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Loader2, Mail, Lock, User, Globe, Briefcase } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();

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
    <div className="min-h-screen flex flex-col animate-gradient-x bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="flex flex-1">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center group">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 ring-4 ring-blue-500/10">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h2 className="ml-4 text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
                  Time<span className="text-blue-600 dark:text-blue-400">Sync</span>
                </h2>
              </div>
              <p className="mt-4 text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">
                Master your global schedule
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg font-bold">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg font-bold">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold dark:text-white">Welcome back</CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Sign in to manage your global team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold uppercase text-[10px] tracking-widest text-gray-400">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input className="pl-10 bg-gray-50 dark:bg-slate-800 border-none rounded-xl" placeholder="your@email.com" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold uppercase text-[10px] tracking-widest text-gray-400">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input 
                                    className="pl-10 bg-gray-50 dark:bg-slate-800 border-none rounded-xl" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-600/20 rounded-xl font-bold text-lg"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : null}
                          Login
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-gray-100 dark:border-slate-800 mt-4 pt-6">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      New to TimeSync?{' '}
                      <Button variant="link" className="p-0 font-bold text-blue-600 dark:text-blue-400" onClick={() => { const el = document.querySelector('[data-value="register"]'); if (el && typeof el.click === 'function') el.click(); }}>
                        Create account
                      </Button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold dark:text-white">Get Started</CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Join the community of global professionals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold uppercase text-[10px] tracking-widest text-gray-400">Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input className="pl-10 bg-gray-50 dark:bg-slate-800 border-none rounded-xl" placeholder="username" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold uppercase text-[10px] tracking-widest text-gray-400">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input className="pl-10 bg-gray-50 dark:bg-slate-800 border-none rounded-xl" placeholder="your@email.com" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold uppercase text-[10px] tracking-widest text-gray-400">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                  <Input 
                                    className="pl-10 bg-gray-50 dark:bg-slate-800 border-none rounded-xl" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-600/20 rounded-xl font-bold text-lg"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : null}
                          Register
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-gray-100 dark:border-slate-800 mt-4 pt-6">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      Already have an account?{' '}
                      <Button variant="link" className="p-0 font-bold text-blue-600 dark:text-blue-400" onClick={() => { const el = document.querySelector('[data-value="login"]'); if (el && typeof el.click === 'function') el.click(); }}>
                        Sign in
                      </Button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
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
                Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">anywhere</span>,<br />
                Sync <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">everywhere</span>.
              </h2>
              
              <p className="text-xl text-slate-300 mb-10 font-medium leading-relaxed">
                Empower your remote team with seamless timezone management. Schedule meetings with confidence and maintain perfect harmony across the globe.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="font-black text-2xl text-blue-400 mb-1">3+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Free Timezones</div>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="font-black text-2xl text-indigo-400 mb-1">100%</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Remote Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
