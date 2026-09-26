"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = { full_name: string; username: string; phone: string; email?: string; auth_provider: "google" | "password" };

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/py/api/auth/me", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("unauthorized");
        return response.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.replace("/login"));
  }, [router]);

  async function logout() {
    await fetch("/api/py/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/login");
    router.refresh();
  }

  if (!user) return <main className="grid min-h-screen place-items-center bg-[#f7f8ff] text-slate-500">Checking your session…</main>;

  const hasPhone = user.phone && !user.phone.startsWith("email:") && !user.phone.startsWith("google:");

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8ff] p-6">
      <section className="w-full max-w-lg rounded-[32px] border border-indigo-100 bg-white p-8 shadow-[0_24px_70px_rgba(61,73,245,.12)]">
        <div className="mb-8 flex items-center justify-between"><Link href="/" className="font-heading text-xl font-semibold">Excel To JPG</Link><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{user.auth_provider === "google" ? "Google account" : "Signed in"}</span></div>
        <h1 className="font-heading text-4xl">Welcome, <span className="text-[#3d49f5]">{user.full_name}</span></h1>
        <dl className="mt-8 space-y-4 rounded-3xl bg-slate-50 p-6 text-sm">
          <div><dt className="text-slate-500">Username</dt><dd className="mt-1 font-semibold">@{user.username}</dd></div>
          {user.email && (
            <div><dt className="text-slate-500">Email</dt><dd className="mt-1 font-semibold">{user.email}</dd></div>
          )}
          <div><dt className="text-slate-500">Sign-in method</dt><dd className="mt-1 font-semibold">{user.auth_provider === "google" ? "Google" : "Email or phone"}</dd></div>
          {hasPhone && (
            <div><dt className="text-slate-500">Phone</dt><dd className="mt-1 font-semibold">{user.phone}</dd></div>
          )}
        </dl>
        <div className="mt-8 flex gap-3"><Link href="/" className="flex-1 rounded-full bg-[#3d49f5] px-5 py-3 text-center font-semibold text-white">Open converter</Link><button onClick={logout} className="rounded-full border border-slate-200 px-5 py-3 font-semibold">Log out</button></div>
      </section>
    </main>
  );
}
