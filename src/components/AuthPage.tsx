"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, EyeOff, LoaderCircle } from "lucide-react";
import Logo from "@/components/Logo";

type AuthMode = "login" | "signup";

const API_BASE = "/api/py";

interface CountryOption {
  flag: string;
  dial: string;
  name: string;
}

const COUNTRIES: CountryOption[] = [
  { flag: "🇺🇸", dial: "+1", name: "United States" },
  { flag: "🇬🇧", dial: "+44", name: "United Kingdom" },
  { flag: "🇨🇦", dial: "+1", name: "Canada" },
  { flag: "🇦🇺", dial: "+61", name: "Australia" },
  { flag: "🇵🇰", dial: "+92", name: "Pakistan" },
  { flag: "🇮🇳", dial: "+91", name: "India" },
  { flag: "🇦🇪", dial: "+971", name: "UAE" },
  { flag: "🇸🇦", dial: "+966", name: "Saudi Arabia" },
  { flag: "🇩🇪", dial: "+49", name: "Germany" },
  { flag: "🇫🇷", dial: "+33", name: "France" },
];

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {
      // Muted autoplay is retried by the browser when the tab becomes active.
    });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const rawPhone = String(form.get("phone") || form.get("contactPhone") || "");
    const fullPhone = rawPhone ? `${selectedCountry.dial}${rawPhone.replace(/^0+/, "")}` : "";

    const payload =
      mode === "signup"
        ? {
            phone: fullPhone || rawPhone,
            full_name: String(form.get("fullName") || ""),
            username: String(form.get("username") || ""),
            password: String(form.get("password") || ""),
          }
        : {
            identifier:
              String(form.get("identifier") || "").trim() ||
              (loginMethod === "phone" ? fullPhone || rawPhone : String(form.get("contactEmail") || "")),
            password: String(form.get("password") || ""),
          };

    try {
      const response = await fetch(`${API_BASE}/api/auth/${mode}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "Unable to continue. Please try again.");
      router.push("/account");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to continue. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fcfdff] p-3 sm:p-5 lg:p-7 flex items-center justify-center">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1540px] w-full overflow-hidden rounded-[34px] bg-white shadow-xl border border-slate-100 lg:min-h-[calc(100vh-3.5rem)] lg:grid-cols-[46%_54%]">
        
        {/* ===================================================================
            LEFT SECTION: BIG VIVID GRADIENT BOX (Image 2 & 5 Faithful Match)
            =================================================================== */}
        <section className="auth-video-panel relative hidden lg:flex flex-col justify-between overflow-hidden rounded-[30px] bg-gradient-to-br from-[#1a2bf6] via-[#2f40f6] to-[#7f8fff] p-10 xl:p-14 text-white shadow-2xl m-3 border border-blue-400/20 neon-border-glow select-none">
          {/* Real motion background; the gradient remains as a fallback while loading. */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>

          {/* Keeps white text readable without hiding the video movement. */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1729f2]/45 via-white/5 to-[#5365ff]/30 pointer-events-none" />

          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-28 -right-28 h-96 w-96 rounded-full bg-white/12 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-blue-300/15 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none" />

          {/* Top: Site Official Logo */}
          <Link href="/" className="relative z-10 inline-flex items-center gap-3.5 text-white transition-opacity hover:opacity-95 group">
            <div className="relative h-12 w-10 shrink-0 drop-shadow-md">
              <Logo size="md" showText={false} />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading text-2xl font-bold leading-none tracking-tight text-white drop-shadow-xs">Excel To</span>
              <span className="font-heading text-2xl font-bold leading-none tracking-tight text-white mt-0.5 drop-shadow-xs">Jpg</span>
            </div>
          </Link>

          {/* Center-Bottom Hero Text & Step Cards */}
          <div className="relative z-10 mt-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/95 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md backdrop-blur-xs">
              {mode === "signup" ? "Join Us To Build 👋" : "Welcome back 👋"}
            </div>

            {/* Headline */}
            <h2 className="mt-6 font-heading text-5xl xl:text-6xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm">
              Start Your <span className="text-[#263af5]">Journey</span>
            </h2>

            {/* Subtitle */}
            <p className="mt-3.5 text-base xl:text-lg text-white/95 font-medium max-w-md">
              Follow these steps to setup your account.
            </p>

            {/* 3 Step Cards */}
            <div className="mt-9 grid grid-cols-3 gap-3.5">
              {/* Step 01: Active Filled Blue Card */}
              <div className="group/step relative flex min-h-[145px] flex-col justify-between rounded-[22px] border border-white/40 bg-[#2537f5] p-5 text-white shadow-lg transition-transform duration-200 hover:-translate-y-1">
                <span className="text-2xl font-bold">01</span>
                <span className="text-xs sm:text-sm font-semibold leading-tight">Register your account</span>
              </div>

              {/* Step 02: Setup profile card */}
              <div className="group/step relative flex min-h-[145px] flex-col justify-between rounded-[22px] border border-white bg-white/95 p-5 text-[#2437f5] shadow-md transition-transform duration-200 hover:-translate-y-1">
                <span className="text-2xl font-bold text-[#2437f5]">02</span>
                <span className="text-xs sm:text-sm font-semibold leading-tight text-[#2437f5]">Setup your profile Information</span>
              </div>

              {/* Step 03: Verify identity card */}
              <div className="group/step relative flex min-h-[145px] flex-col justify-between rounded-[22px] border border-white bg-white/95 p-5 text-[#2437f5] shadow-md transition-transform duration-200 hover:-translate-y-1">
                <span className="text-2xl font-bold text-[#2437f5]">03</span>
                <span className="text-xs sm:text-sm font-semibold leading-tight text-[#2437f5]">Verify your identity through ID</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            RIGHT SECTION: FORM (Image 2 for Login, Image 5 for Signup)
            =================================================================== */}
        <section className="flex flex-col items-center justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-[560px]">
            {/* Mobile Header Logo */}
            <Link href="/" className="mb-8 inline-flex items-center gap-3 lg:hidden">
              <Logo size="sm" showText={true} />
            </Link>

            {/* Title */}
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#101010]">
              {mode === "signup" ? (
                <>Join <span className="text-[#355BFF]">Us</span></>
              ) : (
                <>Welcome <span className="text-[#355BFF]">Back</span></>
              )}
            </h1>

            {/* Form */}
            <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
              {mode === "signup" ? (
                /* -----------------------------------------------------------
                   SIGNUP MODE (Image 5 Match)
                   ----------------------------------------------------------- */
                <>
                  {/* Phone Number with Flag Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">Phone number</label>
                    <div className="auth-pill-wrapper neon-border-glow flex items-center px-4">
                      {/* Flag Picker */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCountryOpen(!isCountryOpen)}
                          className="flex items-center gap-1.5 py-3.5 pr-2.5 text-slate-800 hover:text-blue-600 transition cursor-pointer"
                        >
                          <span className="text-xl">{selectedCountry.flag}</span>
                          <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isCountryOpen && (
                          <div className="absolute top-full left-0 z-50 mt-2 max-h-56 w-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl">
                            {COUNTRIES.map((c) => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                              >
                                <span className="text-lg">{c.flag}</span>
                                <span className="flex-1 truncate">{c.name}</span>
                                <span className="text-slate-400">{c.dial}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-400 mr-2 select-none">{selectedCountry.dial}</span>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="0000 0000 0"
                        required
                        className="min-w-0 flex-1 bg-transparent py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Two Columns: Full Name & Username */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-900">Full name</label>
                      <div className="auth-pill-wrapper neon-border-glow">
                        <input
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          placeholder="joseph john"
                          required
                          className="w-full rounded-full bg-transparent px-6 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-900">Username</label>
                      <div className="auth-pill-wrapper neon-border-glow">
                        <input
                          name="username"
                          type="text"
                          autoComplete="username"
                          placeholder="jj13545js"
                          required
                          className="w-full rounded-full bg-transparent px-6 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* -----------------------------------------------------------
                   LOGIN MODE (Image 2 Match)
                   ----------------------------------------------------------- */
                <>
                  {/* Full Name Or Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">Full name Or Username</label>
                    <div className="auth-pill-wrapper neon-border-glow">
                      <input
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        placeholder="joseph john"
                        required
                        className="w-full rounded-full bg-transparent px-6 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Method Switcher: Phone number vs Through Email */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setLoginMethod("phone")}
                        className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          loginMethod === "phone"
                            ? "border border-[#8790ff] bg-slate-50 text-slate-900 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Phone number
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod("email")}
                        className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          loginMethod === "email"
                            ? "border border-[#8790ff] bg-slate-50 text-[#355BFF] shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Through Email
                      </button>
                    </div>

                    {loginMethod === "phone" ? (
                      <div className="auth-pill-wrapper neon-border-glow flex items-center px-4">
                        {/* Flag Picker */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                            className="flex items-center gap-1.5 py-3.5 pr-2.5 text-slate-800 hover:text-blue-600 transition cursor-pointer"
                          >
                            <span className="text-xl">{selectedCountry.flag}</span>
                            <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
                          </button>

                          {isCountryOpen && (
                            <div className="absolute top-full left-0 z-50 mt-2 max-h-56 w-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl">
                              {COUNTRIES.map((c) => (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }}
                                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                                >
                                  <span className="text-lg">{c.flag}</span>
                                  <span className="flex-1 truncate">{c.name}</span>
                                  <span className="text-slate-400">{c.dial}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-400 mr-2 select-none">{selectedCountry.dial}</span>
                        <input
                          name="contactPhone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="0000 0000 0"
                          className="min-w-0 flex-1 bg-transparent py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                        />
                      </div>
                    ) : (
                      <div className="auth-pill-wrapper neon-border-glow flex items-center px-6">
                        <span className="text-lg font-bold text-[#355BFF] mr-3 select-none">@</span>
                        <input
                          name="contactEmail"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          className="min-w-0 flex-1 bg-transparent py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">Password</label>
                <div className="auth-pill-wrapper neon-border-glow relative flex items-center pr-4">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    placeholder="************"
                    required
                    minLength={8}
                    className="w-full rounded-full bg-transparent pl-6 pr-12 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 text-blue-600 hover:text-blue-800 transition p-1 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 font-normal leading-relaxed pt-1 select-none">
                  • At least 8 characters with symbols, letters, and One uppercase letter is crucial for a strong passwords
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              {/* Action Button with Neon Hover Animation */}
              <button
                type="submit"
                disabled={busy}
                className="neon-border-glow relative flex w-full items-center justify-center rounded-full bg-[#355BFF] hover:bg-blue-700 py-4 text-base font-bold text-white shadow-[0_10px_25px_rgba(53,91,255,0.35)] transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {busy && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
                {mode === "signup" ? "Continue" : "Login Now"}
              </button>
            </form>

            {/* Switch Mode Prompt */}
            <p className="mt-6 text-center text-sm font-medium text-slate-700">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-[#355BFF] hover:underline">
                    login here
                  </Link>
                </>
              ) : (
                <>
                  Create an account?{" "}
                  <Link href="/signup" className="font-semibold text-[#355BFF] hover:underline">
                    Signup here
                  </Link>
                </>
              )}
            </p>

            {/* "or" Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google Auth Button with Neon Glow */}
            <button
              type="button"
              onClick={() => setError("Google sign-in requires OAuth configuration. Please sign in with your username/phone and password.")}
              className="auth-pill-wrapper neon-border-glow flex w-full items-center justify-center gap-3.5 py-3.5 text-base font-bold text-slate-800 transition-all hover:bg-slate-50 cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{mode === "signup" ? "Sign Up With Google" : "Login With Google"}</span>
            </button>

            {/* Terms and Privacy Policy */}
            <p className="mt-8 text-center text-xs leading-relaxed text-slate-500">
              By continuing, you confirm that you agree with the{" "}
              <Link href="/terms" className="font-semibold text-[#355BFF] hover:underline">terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-[#355BFF] hover:underline">privacy policy</Link>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
