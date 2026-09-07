"use client";

import Link from "next/link";

import { neonClient } from "@/lib/neon/client";

export function AuthEntryActions() {
  const { data: session, isPending } = neonClient.auth.useSession();

  if (isPending) {
    return (
      <p aria-live="polite" className="mt-8 text-sm text-[#75756F]">
        Checking your session…
      </p>
    );
  }

  if (session) {
    return (
      <Link
        className="mt-8 inline-flex min-h-11 items-center justify-center bg-[#A71D31] px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#851526] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31]"
        href="/dashboard"
      >
        Open your contacts
      </Link>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        className="inline-flex min-h-11 items-center justify-center bg-[#A71D31] px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#851526] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31]"
        href="/auth/sign-up"
      >
        Create an account
      </Link>
      <Link
        className="inline-flex min-h-11 items-center justify-center border border-[#C9C8BD] bg-transparent px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#191918] transition-colors hover:bg-[#ECEBE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31]"
        href="/auth/sign-in"
      >
        Sign in
      </Link>
    </div>
  );
}
