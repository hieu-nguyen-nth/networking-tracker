import type {
  ContactPriorityFilter,
  ContactSort,
} from "@/features/contacts/utils/contact-view";
import { CustomSelect } from "@/components/ui/custom-select";

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
  "min-h-11 border border-[#C9C8BD] bg-[#FAFAF5] px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#474744] outline-none transition-colors placeholder:font-normal placeholder:tracking-normal placeholder:text-[#75756F] focus:border-[#A71D31] focus:ring-2 focus:ring-[#EAD1D6]";

const priorityOptions = [
  { label: "All priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
] as const;

const sortOptions = [
  { label: "Recently updated", value: "newest" },
  { label: "Least recently updated", value: "oldest" },
  { label: "Name A–Z", value: "name" },
  { label: "Company A–Z", value: "company" },
  { label: "Priority", value: "priority" },
] as const;

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
        <label className="grid gap-2 text-sm font-medium text-[#474744]">
          Search contacts
          <input
            className={controlClassName}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Name, company, role, or notes"
            type="search"
            value={query}
          />
        </label>

        <div className="grid gap-2 text-sm font-medium text-[#474744]">
          <span>Priority</span>
          <CustomSelect
            ariaLabel="Filter contacts by priority"
            onChange={onPriorityChange}
            options={priorityOptions}
            value={priority}
          />
        </div>

        <div className="grid gap-2 text-sm font-medium text-[#474744]">
          <span>Sort by</span>
          <CustomSelect
            ariaLabel="Sort contacts"
            onChange={onSortChange}
            options={sortOptions}
            value={sort}
          />
        </div>
      </div>

      <p aria-live="polite" className="mt-3 text-sm font-normal tracking-normal text-[#75756F]">
        Showing {resultCount} of {totalCount} {totalCount === 1 ? "contact" : "contacts"}
      </p>
    </section>
  );
}
