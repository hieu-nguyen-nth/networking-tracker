"use client";

import { AuthView } from "@neondatabase/auth-ui";
import Link from "next/link";

type AuthScreenProps = Readonly<{
  path: string;
}>;

export function AuthScreen({ path }: AuthScreenProps) {
  return (
    <main className="grid min-h-screen bg-[#FAFAF5] text-[#191918] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden border-r border-[#E3E2D8] bg-[#ECEBE0] p-12 lg:flex lg:flex-col lg:justify-between">
        <Link className="text-xs font-medium uppercase tracking-[0.16em]" href="/">
          Berkeley Networking Tracker
        </Link>
        <div className="max-w-lg">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A71D31]">
            Your network, remembered
          </p>
          <h1 className="mt-6 text-5xl font-medium leading-[1.05] tracking-[-0.04em]">
            Keep meaningful Berkeley connections within reach.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#474744]">
            Every contact is private to your account and protected by database
            Row Level Security.
          </p>
        </div>
        <p className="text-sm text-[#75756F]">Secure by design with Neon.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            className="mb-8 inline-flex text-sm text-[#474744] hover:text-[#A71D31] lg:hidden"
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
