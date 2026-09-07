import { AccountMenu } from "@/features/account/components/account-menu";

export function ContactDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Berkeley Networking Tracker
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Your contacts
            </h1>
          </div>
          <AccountMenu />
        </header>

        <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">Your private dashboard is ready.</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Contact creation, editing, sorting, and filtering will be connected
            here in the next workflow phase.
          </p>
        </section>
      </div>
    </main>
  );
}
