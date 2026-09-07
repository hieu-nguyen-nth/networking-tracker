"use client";

import { AuthView } from "@neondatabase/auth-ui";
import Link from "next/link";

type AuthScreenProps = Readonly<{
  path: string;
}>;

export function AuthScreen({ path }: AuthScreenProps) {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_1.1fr]">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link className="text-sm font-semibold tracking-wide" href="/">
          Berkeley Networking Tracker
        </Link>
        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
            Your network, remembered
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Keep meaningful Berkeley connections within reach.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Every contact is private to your account and protected by database
            Row Level Security.
          </p>
        </div>
        <p className="text-sm text-slate-400">Secure by design with Neon.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            className="mb-8 inline-flex text-sm font-medium text-slate-600 hover:text-slate-950 lg:hidden"
            href="/"
          >
            ← Berkeley Networking Tracker
          </Link>
          <AuthView path={path} redirectTo="/dashboard" />
        </div>
      </section>
    </main>
  );
}
