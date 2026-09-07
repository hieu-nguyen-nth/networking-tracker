import type {
  ContactPriorityFilter,
  ContactSort,
} from "@/features/contacts/utils/contact-view";

type ContactControlsProps = Readonly<{
  onPriorityChange: (priority: ContactPriorityFilter) => void;
  onQueryChange: (query: string) => void;
  onSortChange: (sort: ContactSort) => void;
  priority: ContactPriorityFilter;
  query: string;
  resultCount: number;
  sort: ContactSort;
  totalCount: number;
}>;

const controlClassName =
  "min-h-11 border border-[#C9C8BD] bg-[#FAFAF5] px-3 py-2 text-sm text-[#191918] outline-none transition-colors focus:border-[#A71D31] focus:ring-2 focus:ring-[#EAD1D6]";

export function ContactControls({
  onPriorityChange,
  onQueryChange,
  onSortChange,
  priority,
  query,
  resultCount,
  sort,
  totalCount,
}: ContactControlsProps) {
  return (
    <section
      aria-label="Contact list controls"
      className="mb-5 border border-[#E3E2D8] bg-[#F4F4EB] p-4"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_180px_180px]">
        <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#75756F]">
          Search contacts
          <input
            className={controlClassName}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Name, company, role, or notes"
            type="search"
            value={query}
          />
        </label>

        <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#75756F]">
          Priority
          <select
            className={controlClassName}
            onChange={(event) =>
              onPriorityChange(event.target.value as ContactPriorityFilter)
            }
            value={priority}
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#75756F]">
          Sort by
          <select
            className={controlClassName}
            onChange={(event) => onSortChange(event.target.value as ContactSort)}
            value={sort}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A–Z</option>
            <option value="company">Company A–Z</option>
            <option value="priority">Priority</option>
          </select>
        </label>
      </div>

      <p aria-live="polite" className="mt-3 text-sm text-[#75756F]">
        Showing {resultCount} of {totalCount} {totalCount === 1 ? "contact" : "contacts"}
      </p>
    </section>
  );
}
