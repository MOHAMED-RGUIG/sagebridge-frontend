"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authActions } from "@/features/auth/authSlice";
import type React from "react";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(authActions.loginStart());

    try {
      // ✅ placeholder: remplace par ton vrai backend plus tard
      // ex: POST /api/auth/login
      await new Promise((r) => setTimeout(r, 600));

      if (!email || !password) throw new Error("Email & mot de passe requis");

      // Token fake (remplace par le token renvoyé par ton API)
      const token = "fake-jwt-token";
      dispatch(authActions.loginSuccess({ token, user: { email } }));

      if (remember) localStorage.setItem("sb_token", token);
      else localStorage.removeItem("sb_token");

      router.replace("/");
    } catch (err: any) {
      dispatch(authActions.loginError(err?.message ?? "Erreur login"));
    }
  }

  return (
    <div className="min-h-screen w-full bg-[hsl(var(--bg))]">
      <div className="flex min-h-screen w-full">
        {/* LEFT IMAGE */}
        <div className="relative hidden w-1/2 md:block">
          <Image
            src="https://glassauto.ma/stackebi/2021/12/3.jpg"
            alt="leftSideImage"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* RIGHT FORM */}
        <div className="flex w-full items-center justify-center px-6 py-10 md:w-1/2">
<form
  onSubmit={onSubmit}
  className="
    w-full max-w-[420px]
    rounded-3xl
    bg-white/60 backdrop-blur-xl
    border border-white/40
    shadow-2xl shadow-indigo-500/10
    p-10
  "
>
  <h2 className="text-4xl font-bold text-text tracking-tight">Sign in</h2>

  <p className="mt-2 text-sm text-muted">Bienvenue 👋 Merci de se connecter</p>

  {/* EMAIL */}
  <div className="mt-8 relative">
    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted">📧</span>
    <Input
      type="text"
      placeholder="Nom d'utilisateur"
      className="
        h-12 w-full pl-12 pr-4
        rounded-full
        border border-border/60
        bg-white/70 backdrop-blur
        text-sm text-text/90
        placeholder:text-muted
        focus:ring-2 focus:ring-[hsl(var(--brand))]/30
        transition
      "
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>

  {/* PASSWORD */}
  <div className="mt-6 relative">
    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted">🔒</span>
    <Input
      type="password"
      placeholder="Password"
      className="
        h-12 w-full pl-12 pr-4
        rounded-full
        border border-border/60
        bg-white/70 backdrop-blur
        text-sm text-text/90
        placeholder:text-muted
        focus:ring-2 focus:ring-[hsl(var(--brand))]/30
        transition
      "
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>

  {/* ERROR */}
  {error && (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </div>
  )}

  {/* REMEMBER / FORGOT */}
  <div className="mt-8 flex items-center justify-between text-sm text-text/70">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        className="h-4 w-4 accent-[hsl(var(--brand))]"
        type="checkbox"
        checked={remember}
        onChange={(e) => setRemember(e.target.checked)}
      />
      Remember me
    </label>

    <button
      type="button"
      className="hover:text-text transition"
      onClick={() => alert("Forgot password plus tard")}
    >
      Forgot password?
    </button>
  </div>

  {/* SUBMIT */}
  <button
    type="submit"
    disabled={isLoading}
    className="
      mt-8 h-12 w-full rounded-full
      bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600
      text-white font-semibold
      shadow-lg shadow-indigo-500/25
      transition hover:scale-[1.02] active:scale-95
      disabled:opacity-60
    "
  >
    {isLoading ? "Loading..." : "Login"}
  </button>

  <p className="mt-6 text-center text-sm text-muted">
    Don’t have an account?{" "}
    <button
      type="button"
      className="font-semibold text-[hsl(var(--brand))] hover:underline"
      onClick={() => alert("Sign up plus tard")}
    >
      Sign up
    </button>
  </p>
</form>

        </div>
      </div>
    </div>
  );
}
