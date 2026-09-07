"use client";

import { AuthProvider } from "@/features/auth/components/auth-provider";

type ProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function Providers({ children }: ProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
