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
    <div className="flex flex-wrap items-center justify-end gap-2">
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
        className="min-h-8 bg-transparent px-2 py-1 text-[11px] font-medium tracking-normal text-[#75756F] transition-colors hover:bg-[#ECEBE0] hover:text-[#191918] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31] disabled:cursor-wait disabled:opacity-60"
        disabled={isSigningOut}
        onClick={handleSignOut}
        type="button"
      >
        {isSigningOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
