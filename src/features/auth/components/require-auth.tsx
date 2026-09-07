"use client";

import { RedirectToSignIn } from "@neondatabase/auth-ui";

import { neonClient } from "@/lib/neon/client";

type RequireAuthProps = Readonly<{
  children: React.ReactNode;
}>;

export function RequireAuth({ children }: RequireAuthProps) {
  const { data: session, isPending } = neonClient.auth.useSession();

  if (isPending) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center bg-slate-50"
      >
        <p className="text-sm font-medium text-slate-600">
          Checking your session…
        </p>
      </main>
    );
  }

  if (!session) {
    return <RedirectToSignIn />;
  }

  return children;
}
