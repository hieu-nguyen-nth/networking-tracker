# Berkeley Networking Tracker

A secure, full-stack networking tracker for maintaining relationships with people you meet at Berkeley. Authenticated users can create, view, edit, delete, sort, and filter their own contacts. Neon Postgres provides persistent storage, Neon Managed Better Auth handles authentication, and Row Level Security prevents users from accessing contacts they do not own.

## Live Application

[Open the live Berkeley Networking Tracker](https://networking-tracker-iota-mauve.vercel.app)

The production deployment was verified on September 8, 2026. The public homepage and sign-up route both return successfully, and the production alias is registered as a trusted Neon Auth origin.

## Product Walkthrough

1. Open the live application and choose **Create account** or **Sign in**. After authentication, the app opens the private contacts dashboard and identifies the active account in the header.
2. Choose **Add contact**, complete the contact details, select a priority, and save. The new contact appears with a success message and remains present after a full browser refresh because it is stored in Neon Postgres.
3. Use the search box to search across contact details, narrow the list by priority, or sort by recently updated, least recently updated, name, company, or priority. A clear no-results panel provides a one-click way to clear filters.
4. Choose **Edit** to update a saved contact in a focused modal. A dated success notice appears briefly, the card's `Updated MM/DD/YYYY` value changes, and recent-first sorting uses that updated timestamp. Choose **Delete** to display a confirmation before permanently deleting it.
5. Submitting a blank name produces the field-level message `Name is required.` Invalid priority values are rejected by application validation and by a database constraint.
6. Use **Sign out** to end the session. A signed-out visitor cannot open the contacts dashboard and is sent to the authentication flow.

A dated record of the local checks, automated test result, persistence check, and two-account isolation procedure is available in [Grading evidence](docs/evidence/verification.md).

## Features

- Sign up, sign in, and sign out with Neon Managed Better Auth
- Private contact records for every authenticated user
- Create, view, edit, and delete contacts
- Sort and filter contacts
- Responsive desktop and mobile layouts
- Clear loading, empty, success, and error states
- Database-enforced validation and Postgres Row Level Security

## Technology Stack

- **Next.js and React:** Full-stack application framework and user interface
- **TypeScript:** Static type safety
- **Tailwind CSS:** Responsive, consistent styling
- **Neon Postgres:** Persistent relational database
- **Neon Managed Better Auth:** User authentication
- **Neon Data API and `@neondatabase/neon-js`:** Authenticated data access
- **Vitest:** Automated validation tests
- **Vercel:** Production hosting

## Architecture

```text
User -> Next.js UI -> Neon JS client -> Neon Data API -> RLS -> Neon Postgres
                     Neon Managed Better Auth supplies the authenticated user
```

The project separates routing, shared interface components, configuration, infrastructure, and feature logic:

```text
networking-tracker/
├── src/
│   ├── app/                  # Thin Next.js routes, layout, and providers
│   ├── components/ui/        # Reusable interface components
│   ├── config/               # Application environment configuration
│   ├── features/
│   │   ├── account/          # Current-user profile and account behavior
│   │   ├── auth/             # Authentication screens and session controls
│   │   └── contacts/         # Contact UI, hooks, data, types, and validation
│   └── lib/neon/             # Neon client and database types
├── database/migrations/      # Contacts schema, constraints, and RLS policies
├── docs/evidence/            # Requirement-verification record
├── public/                   # Static browser assets
└── *.config.* / neon.ts      # Tool-discovered project configuration
```

Route files remain intentionally thin and compose feature components rather than containing authentication, database, or form logic.

### Why configuration files remain at the repository root

The root is reserved for project-wide files that are discovered by their respective tools. `package.json` and `package-lock.json` define the npm project; `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, and `vitest.config.mts` configure Next.js, TypeScript, ESLint, PostCSS, and Vitest. `neon.ts` is the Neon CLI configuration and must remain at the project root for standard `neon` commands. Moving these files into `src/config/` would require custom command-line flags or wrapper scripts and would make local setup and Vercel deployment less conventional.

By contrast, `src/config/public-env.ts` contains application runtime configuration and therefore belongs inside the source tree. `.neon`, `.agents/`, `skills-lock.json`, `AGENTS.md`, and `CLAUDE.md` are non-secret development-tool metadata and guidance created by the project setup commands; they do not contain application features or production credentials.

## Local Setup

### Prerequisites

- Node.js
- npm
- A Neon project with Managed Better Auth and the Data API enabled

### Installation

```bash
git clone https://github.com/hieu-nguyen-nth/networking-tracker.git
cd networking-tracker
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Required variable names are documented in `.env.example`. Real credentials belong only in `.env.local` and Vercel's encrypted environment settings.

```env
NEXT_PUBLIC_NEON_AUTH_URL=
NEXT_PUBLIC_NEON_DATA_API_URL=
```

`DATABASE_URL`, `NEON_AUTH_BASE_URL`, cookie secrets, and other secret values must remain server-only if used. Never commit real values.

## Database Schema

The `contacts` table contains:

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `user_id` | text | Owner; defaults to `auth.user_id()` and cannot be null |
| `name` | text | Required contact name |
| `company` | text | Optional company |
| `role` | text | Optional role or title |
| `where_met` | text | Optional meeting context |
| `notes` | text | Optional notes |
| `priority` | text | `high`, `medium`, or `low` |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last update time |

The version-controlled migrations create this schema, enforce nonblank names and valid priorities, index `user_id`, and maintain `updated_at` automatically.

## Authentication and Row Level Security

Neon Managed Better Auth identifies the signed-in user. The `contacts.user_id` column defaults to `auth.user_id()`. Row Level Security is enabled with separate `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies requiring the authenticated user ID to match the row owner. Insert and update policies use `WITH CHECK` so ownership cannot be assigned or transferred to another user.

| Policy | Operation | Ownership rule |
| --- | --- | --- |
| `contacts_select_own` | `SELECT` | `USING (auth.user_id() = user_id)` |
| `contacts_insert_own` | `INSERT` | `WITH CHECK (auth.user_id() = user_id)` |
| `contacts_update_own` | `UPDATE` | Matching `USING` and `WITH CHECK` rules |
| `contacts_delete_own` | `DELETE` | `USING (auth.user_id() = user_id)` |

RLS is both enabled and forced. The anonymous role has no contact-table privileges; the authenticated role receives CRUD privileges subject to these policies. Database metadata verification confirms all four policies are active.

### Two-account privacy verification

On September 7, 2026, the ownership boundary was manually verified with two real Neon Auth accounts:

1. Account A created a contact and could see only Account A's contact.
2. Account B created a different contact and could see only Account B's contact.
3. Switching between the accounts confirmed that neither account could read the other account's contact through the application.
4. A read-only database check independently confirmed two Auth users, two contact rows, and two distinct `user_id` owners.

Because update and delete use the same ownership predicate—and updates also use `WITH CHECK`—the database applies that identity boundary to reads, edits, ownership changes, and deletion rather than relying on hidden frontend controls.

## Testing

```bash
npm test
```

The automated validation suite verifies that valid contacts are trimmed and normalized, empty optional fields become `null`, blank names fail with a clear message, and priorities outside `high`, `medium`, or `low` are rejected. Zod provides immediate application feedback, while Postgres `CHECK` and `NOT NULL` constraints enforce the critical rules even if browser validation is bypassed.

Latest verified result: **2 test files passed, 9 tests passed** on September 8, 2026. The complete result is recorded in [Grading evidence](docs/evidence/verification.md#automated-test-output).

## Deployment

The application is deployed from this public GitHub repository to Vercel. To reproduce the deployment:

1. Create or link a Vercel project from the repository root.
2. Add `NEXT_PUBLIC_NEON_AUTH_URL` and `NEXT_PUBLIC_NEON_DATA_API_URL` to the Vercel Production environment. These HTTPS endpoints are intentionally browser-safe; do not upload `DATABASE_URL`, cookie secrets, or other server credentials.
3. Deploy the project to production with `vercel deploy --prod` or through the connected Git repository.
4. Add the stable Vercel origin to the production branch's Neon Auth trusted domains.
5. Open the public homepage and `/auth/sign-up` in a fresh browser session, then verify authentication and the contact workflow.

Production URL: [https://networking-tracker-iota-mauve.vercel.app](https://networking-tracker-iota-mauve.vercel.app)

## Known Limitations and Future Improvements

- No contact sharing or team workspaces
- No administrator dashboard
- No bulk import or export
- No AI functionality
- Contact search and sorting currently run in the browser, which is appropriate for this assignment-sized data set; a larger product would add server pagination and indexed search.
- Future improvements would include follow-up reminders, CSV import/export, and expanded end-to-end browser automation.

## Grading Evidence

- [x] Public Vercel application URL
- [x] Sign-in and sign-out verification
- [x] Create, edit, delete, and refresh-persistence verification
- [x] Invalid-input verification
- [x] Passing automated test output
- [x] Two-account privacy-test evidence
- [x] Schema and RLS explanation
- [x] Confirmation that no secrets are committed

See the complete [verification record](docs/evidence/verification.md), which contains no passwords, session tokens, connection strings, or private environment values.
