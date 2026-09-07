"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { neonClient } from "@/lib/neon/client";

type AuthProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={neonClient.auth}
      Link={Link}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={router.refresh}
      redirectTo="/dashboard"
    >
      {children}
    </NeonAuthUIProvider>
  );
}
