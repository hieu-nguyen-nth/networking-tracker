"use client";

import Link from "next/link";

import { neonClient } from "@/lib/neon/client";

export function AuthEntryActions() {
  const { data: session, isPending } = neonClient.auth.useSession();

  if (isPending) {
    return (
      <p aria-live="polite" className="mt-8 text-sm text-slate-500">
        Checking your session…
      </p>
    );
  }

  if (session) {
    return (
      <Link
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        href="/dashboard"
      >
        Open your contacts
      </Link>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        href="/auth/sign-up"
      >
        Create an account
      </Link>
      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        href="/auth/sign-in"
      >
        Sign in
      </Link>
    </div>
  );
}
