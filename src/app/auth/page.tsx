"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import { AuthService } from "@/service/api/auth-service";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (type === "signup" && password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = type === "login" 
        ? await AuthService.login(email, password)
        : await AuthService.signup(email, password);

      if (response.success) {
        // console.log(`${type === "login" ? "Login" : "Signup"} successful!`);
        router.push("/");
      } else {
        setError(response.error?.details || `${type === "login" ? "Login" : "Signup"} failed. Please try again.`);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10"></div>
        <Image 
          src="https://images.pexels.com/photos/2099737/pexels-photo-2099737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Background" 
          fill 
          style={{ objectFit: 'cover' }} 
          priority
          className="z-0"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-4 md:p-6">
          <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
            {/* Signup Card - Left Side */}
            <motion.div
              className="min-h-[500px] md:col-span-1"
              initial={{ opacity: 0, x: "-100%" }}
              animate={{
                opacity: activeTab === "signup" ? 1 : 0,
                x: activeTab === "signup" ? 0 : "-100%"
              }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full shadow-lg border-white bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Sign Up</CardTitle>
                  <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && activeTab === "signup" && (
                    <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                  <form onSubmit={(e) => handleAuth(e, "signup")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setActiveTab("login");
                        setError(null);
                      }}
                      className="text-pink-600 hover:underline"
                    >
                      Login
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Login Card - Right Side */}
            <motion.div
              className="min-h-[500px] md:col-span-1"
              initial={{ opacity: 0, x: "100%" }}
              animate={{
                opacity: activeTab === "login" ? 1 : 0,
                x: activeTab === "login" ? 0 : "100%"
              }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full shadow-lg border-white bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Login</CardTitle>
                  <CardDescription>Enter your email and password to login.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && activeTab === "login" && (
                    <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                  <form onSubmit={(e) => handleAuth(e, "login")} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{` `}
                    <button
                      onClick={() => {
                        setActiveTab("signup");
                        setError(null);
                      }}
                      className="text-pink-600 hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}