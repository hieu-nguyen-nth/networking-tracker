"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { neonClient } from "@/lib/neon/client";

export function AccountMenu() {
  const router = useRouter();
  const { data: session } = neonClient.auth.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage(null);

    try {
      await neonClient.auth.signOut();
      router.replace("/auth/sign-in");
      router.refresh();
    } catch {
      setErrorMessage("Sign out failed. Please try again.");
      setIsSigningOut(false);
    }
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <div className="min-w-0 text-right">
        <p className="truncate text-sm font-medium text-[#191918]">
          {session.user.name || "Your account"}
        </p>
        <p className="truncate text-xs text-[#75756F]">{session.user.email}</p>
        {errorMessage ? (
          <p aria-live="polite" className="mt-1 text-xs text-[#A71D31]">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <button
        className="min-h-11 border border-[#C9C8BD] bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#191918] transition-colors hover:bg-[#ECEBE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31] disabled:cursor-wait disabled:opacity-60"
        disabled={isSigningOut}
        onClick={handleSignOut}
        type="button"
      >
        {isSigningOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
