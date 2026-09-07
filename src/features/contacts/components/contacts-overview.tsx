import { AuthEntryActions } from "@/features/auth/components/auth-entry-actions";

const capabilities = [
  "Private contacts for every account",
  "Create, edit, delete, sort, and filter",
  "Ownership enforced by Postgres Row Level Security",
];

export function ContactsOverview() {
  return (
    <section className="border border-[#E3E2D8] bg-[#F4F4EB] p-7 sm:p-12 lg:p-16">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A71D31]">
        Berkeley Networking Tracker
      </p>
      <h1 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.04] tracking-[-0.04em] sm:text-6xl">
        Stay connected with the people who shape your Berkeley experience.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[#474744]">
        A secure place to remember who you met, what they do, and when to reach
        out next.
      </p>
      <AuthEntryActions />
      <ul className="mt-12 grid border border-[#E3E2D8] text-sm text-[#474744] sm:grid-cols-3">
        {capabilities.map((capability) => (
          <li
            className="border-b border-[#E3E2D8] bg-[#ECEBE0] p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            key={capability}
          >
            {capability}
          </li>
        ))}
      </ul>
    </section>
  );
}
