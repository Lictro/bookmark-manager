"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("fake_user@fakeemail.com");
  const [password, setPassword] = useState("Test1234!");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

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
    <div className="flex min-h-screen items-center justify-center bg-slate-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border">
        <div className="flex justify-center mb-4">
          <div className="size-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bookmark className="size-6 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2 text-black">
          Bookmark Manager
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          {isLogin
            ? "Sign in to your account"
            : "Create your new account"}
        </p>

        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm rounded-full transition ${
              isLogin
                ? "bg-white shadow text-black"
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
                ? "bg-white shadow text-black"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-800"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}