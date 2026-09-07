"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";

import { neonClient } from "@/lib/neon/client";

type AuthProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <NeonAuthUIProvider authClient={neonClient.auth} redirectTo="/dashboard">
      {children}
    </NeonAuthUIProvider>
  );
}
