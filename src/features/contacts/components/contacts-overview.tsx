import { AuthEntryActions } from "@/features/auth/components/auth-entry-actions";

const capabilities = [
  "Private contacts for every account",
  "Create, edit, delete, sort, and filter",
  "Ownership enforced by Postgres Row Level Security",
];

export function ContactsOverview() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
        Berkeley Networking Tracker
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Stay connected with the people who shape your Berkeley experience.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
        A secure place to remember who you met, what they do, and when to reach
        out next.
      </p>
      <AuthEntryActions />
      <ul className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
        {capabilities.map((capability) => (
          <li
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            key={capability}
          >
            {capability}
          </li>
        ))}
      </ul>
    </section>
  );
}
