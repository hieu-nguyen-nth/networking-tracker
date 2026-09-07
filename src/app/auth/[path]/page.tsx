import { authViewPaths } from "@neondatabase/auth-ui/server";

import { AuthScreen } from "@/features/auth/components/auth-screen";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: PageProps<"/auth/[path]">) {
  const { path } = await params;

  return <AuthScreen path={path} />;
}
