"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Page() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErrorMsg(null);

    try {
      if (!email || !password) {
        setErrorMsg("Please fill in email and password.");
        return;
      }

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        setMsg(
          "Account created. Check your email to confirm, then come back and log in."
        );
        setMode("login");
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-gray-600">
            {mode === "login"
              ? "Log in to access your dashboard."
              : "Create an account to save lesson plans."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {msg && (
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {msg}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Sign in"
              : "Create account"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setMsg(null);
                setErrorMsg(null);
                setMode((m) => (m === "login" ? "signup" : "login"));
              }}
              className="text-gray-700 hover:underline"
            >
              {mode === "login"
                ? "No account? Create one"
                : "Already have an account? Sign in"}
            </button>

            <Link href="/dashboard" className="text-gray-700 hover:underline">
              Go to dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
