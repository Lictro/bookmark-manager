"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bookmark, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { useBookmarkUI } from "@/context/BookmarkUIContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {theme,
      toggleTheme,
    } = useBookmarkUI();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const DEFAULT_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "";
  const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "";
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  // Redirect to / if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/')
    }
  }, [authLoading, user, router])

  if (user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin) {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
          },
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        toast.success("Check your email to confirm your account");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Welcome!!");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 size-14 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Toggle theme"
      >
        <div className="relative size-6">
          <Sun className={`size-6 text-amber-500 absolute inset-0 transition-all duration-500 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`} />
          <Moon className={`size-6 text-blue-500 absolute inset-0 transition-all duration-500 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`} />
        </div>
      </button>
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl border">
        <div className="flex justify-center mb-4">
          <div className="size-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <Bookmark className="size-6 text-white" />
            </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          Bookmark Manager
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to your account or create a new one
        </p>

        <div className="flex bg-muted rounded-full p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm rounded-full transition ${
              isLogin
                ? "bg-card shadow"
                : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-sm rounded-full transition ${
              !isLogin
                ? "bg-card shadow "
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}