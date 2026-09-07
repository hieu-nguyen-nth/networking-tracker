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

      <section className="flex min-h-screen items-start justify-center px-5 py-8 sm:px-8 lg:items-center lg:py-12">
        <div className="w-full max-w-lg">
          <Link
            className="mb-6 inline-flex text-sm text-[#474744] hover:text-[#A71D31] lg:hidden"
            href="/"
          >
            ← Berkeley Networking Tracker
          </Link>
          <AuthView
            classNames={{
              base:
                "max-w-none border-[#E3E2D8] bg-[#F4F4EB] text-[#191918] shadow-none rounded-[2px] py-7",
              content: "px-6 sm:px-8",
              description: "text-[#75756F]",
              footer: "px-6 sm:px-8",
              footerLink: "text-[#A71D31] hover:text-[#851526]",
              header: "px-6 sm:px-8",
              title: "font-medium tracking-[-0.03em] text-[#191918]",
              form: {
                error: "text-[#A71D31]",
                forgotPasswordLink: "text-[#A71D31] hover:text-[#851526]",
                input:
                  "min-h-11 rounded-[2px] border-[#C9C8BD] bg-[#FAFAF5] text-[#191918] shadow-none focus-visible:border-[#A71D31] focus-visible:ring-[#EAD1D6]",
                label: "text-[#474744]",
                primaryButton:
                  "min-h-11 rounded-[2px] bg-[#A71D31] text-white shadow-none hover:bg-[#851526]",
                secondaryButton:
                  "min-h-11 rounded-[2px] border-[#C9C8BD] bg-[#FAFAF5] text-[#191918] shadow-none hover:bg-[#ECEBE0]",
              },
            }}
            path={path}
            redirectTo="/dashboard"
          />
        </div>
      </section>
    </main>
  );
}
