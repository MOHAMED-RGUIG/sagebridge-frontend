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
          <form onSubmit={onSubmit} className="w-full max-w-[380px]">
            <h2 className="text-4xl font-semibold text-text">Sign in</h2>
            <p className="mt-3 text-sm text-muted">
              Welcome back! Please sign in to continue
            </p>

            <button
              type="button"
              className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10"
              onClick={() => alert("Google login plus tard")}
            >
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px w-full bg-border" />
              <p className="whitespace-nowrap text-sm text-muted">
                or sign in with email
              </p>
              <div className="h-px w-full bg-border" />
            </div>

            {/* EMAIL */}
            <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-border bg-white/70 pl-6 focus-within:ring-2 focus-within:ring-[rgba(67,24,255,0.15)]">

              <Input
                type="text"
                placeholder="Email id"
                className="h-full w-full bg-transparent text-sm text-text/80 placeholder:text-muted outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-border bg-white/70 pl-6 focus-within:ring-2 focus-within:ring-[rgba(67,24,255,0.15)]">
           
              <Input
                type="password"
                placeholder="Password"
                className="h-full w-full bg-transparent text-sm text-text/80 placeholder:text-muted outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* ERROR */}
            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {/* REMEMBER / FORGOT */}
            <div className="mt-8 flex w-full items-center justify-between text-text/70">
              <label className="flex items-center gap-2 text-sm">
                <input
                  className="h-5 w-5 accent-[hsl(var(--brand))]"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm underline hover:text-text"
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
                mt-8 h-11 w-full rounded-full
                bg-[hsl(var(--brand))] text-white
                shadow-md shadow-indigo-500/20
                transition hover:opacity-95
                disabled:opacity-60
              "
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            <p className="mt-4 text-sm text-muted">
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-[hsl(var(--brand))] hover:underline"
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
