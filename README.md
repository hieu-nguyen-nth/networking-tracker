# Berkeley Networking Tracker

A secure, full-stack networking tracker for maintaining relationships with people you meet at Berkeley. Authenticated users can create, view, edit, delete, sort, and filter their own contacts. Neon Postgres provides persistent storage, Neon Managed Better Auth handles authentication, and Row Level Security prevents users from accessing contacts they do not own.

> This README is being completed alongside the application. Sections marked **TODO** will be updated with verified production details and evidence before submission.

## Live Application

**TODO:** Add the public Vercel URL after deployment.

## Product Walkthrough

**TODO:** Add screenshots or a short walkthrough covering sign-in, sign-out, contact CRUD, refresh persistence, invalid input, and two-user isolation.

## Features

- Sign up, sign in, and sign out with Neon Managed Better Auth
- Private contact records for every authenticated user
- Create, view, edit, and delete contacts
- Sort and filter contacts
- Responsive desktop and mobile layouts
- Clear loading, empty, success, and error states
- Server-enforced validation and Postgres Row Level Security

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
src/
├── app/                  # Next.js routes, layout, and global providers
├── components/ui/        # Reusable presentation components
├── config/               # Browser-safe environment configuration
├── features/
│   ├── account/          # Current-user profile and account behavior
│   ├── auth/             # Authentication providers, screens, and controls
│   └── contacts/         # Contact UI, validation, types, and data access
└── lib/neon/             # Unified Neon client and generated database types
```

Route files remain intentionally thin and compose feature components rather than containing authentication, database, or form logic.

## Local Setup

### Prerequisites

- Node.js
- npm
- A Neon project with Managed Better Auth and the Data API enabled

### Installation

```bash
git clone <repository-url>
cd networking-tracker
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**TODO:** Replace the repository placeholder and document any additional setup commands.

## Environment Variables

The application will document required variable names in `.env.example`. Real credentials belong only in `.env.local` and Vercel's encrypted environment settings.

```env
NEXT_PUBLIC_NEON_AUTH_URL=
NEXT_PUBLIC_NEON_DATA_API_URL=
```

`DATABASE_URL`, `NEON_AUTH_BASE_URL`, cookie secrets, and other secret values must remain server-only if used. Never commit real values.

## Database Schema

The `contacts` table will contain:

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

RLS is both enabled and forced. The anonymous role has no contact-table privileges; the authenticated role receives CRUD privileges subject to these policies. Database metadata verification confirms all four policies are active. **TODO:** Add the two-real-account test results after the authentication UI is complete.

## Testing

```bash
npm test
```

The automated validation suite verifies that valid contacts are trimmed and normalized, empty optional fields become `null`, blank names fail with a clear message, and priorities outside `high`, `medium`, or `low` are rejected. Zod provides immediate application feedback, while Postgres `CHECK` and `NOT NULL` constraints enforce the critical rules even if browser validation is bypassed.

**TODO:** Add a screenshot of the final passing test output to the grading evidence.

## Deployment

The application will be deployed from this public GitHub repository to Vercel. Production environment variables will be configured in Vercel, and the deployed domain will be registered as a trusted Neon Auth origin.

**TODO:** Add the final deployment procedure and public URL.

## Known Limitations and Future Improvements

- No contact sharing or team workspaces
- No administrator dashboard
- No bulk import or export
- No AI functionality

**TODO:** Add limitations discovered during final verification and realistic next improvements.

## Grading Evidence

- [ ] Public Vercel application URL
- [ ] Sign-in and sign-out evidence
- [ ] Create, edit, delete, and refresh-persistence evidence
- [ ] Invalid-input evidence
- [ ] Passing automated test output
- [ ] Two-account privacy-test evidence
- [ ] Schema and RLS explanation
- [ ] Confirmation that no secrets are committed
