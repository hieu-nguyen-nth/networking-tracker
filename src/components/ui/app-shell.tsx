type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF5] px-5 py-16 text-[#191918] sm:px-8 lg:py-28">
      <div className="w-full max-w-7xl">{children}</div>
    </main>
  );
}
