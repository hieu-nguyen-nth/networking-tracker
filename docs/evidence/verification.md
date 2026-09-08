# Grading Evidence

This record summarizes the checks performed through September 8, 2026. It intentionally contains no passwords, access tokens, database connection strings, cookies, or private environment values.

## Local product walkthrough

| Requirement | Verification result |
| --- | --- |
| Sign up, sign in, session persistence, and sign out | Verified with a real Neon Managed Better Auth account. Signed-out access is protected. |
| Create a contact | Created a temporary contact containing every supported field; the dashboard displayed a clear success message. |
| Refresh persistence | Reloaded the dashboard after creation; the saved contact remained visible from Neon Postgres. |
| Edit a contact | Changed the temporary contact's name and saved it; the updated value, `MM/DD/YYYY` timestamp, and temporary success notice appeared. |
| Delete a contact | The first click displayed a confirmation with cancel and delete choices. Confirming removed the contact and displayed a success message. |
| Text search | A search with no matching contact reduced the count to zero and displayed the no-match state. |
| Priority filter | The custom warm-palette menu updated the visible results without relying on the browser's native blue selection UI. |
| Sorting | The custom menu supports recent/least-recent updates, name, company, and priority. Recent ordering uses `updated_at`; **Name A–Z** reordered contacts alphabetically. |
| Clear filters | The no-match state exposed a **Clear filters** action that restored the full list. |
| Blank-name validation | Submitting the contact form without a name displayed `Name is required.` next to the field. |
| Loading, empty, success, and error states | The dashboard provides session/data loading messages, an empty-network panel, success announcements, field errors, and a recoverable fetch-error panel. |
| Responsive and accessible UI | The interface uses responsive grids/cards, associated form labels, minimum-size controls, visible keyboard focus styles, text priority labels, accessible custom listboxes, and a mobile-safe contact modal. |
| Browser runtime | Dashboard reloaded with meaningful content, no framework error overlay, and no application console errors. |

The temporary Phase 15 verification contact was deleted after the walkthrough, leaving the account's original data intact.

## Automated test output

Command:

```bash
npm test
```

Verified output:

```text
Test Files  2 passed (2)
Tests       9 passed (9)
```

The suite covers valid contact input, trimming and normalization, conversion of empty optional values to `null`, blank and whitespace-only name rejection, invalid-priority rejection, contact sorting/filtering behavior, and recent-first ordering by `updated_at`.

Additional quality commands completed successfully:

```text
npm run lint
npx next build --webpack
```

The production build compiled successfully, completed TypeScript validation, generated all application pages, and collected build traces.

## Two-account privacy verification

1. Account A created a recognizable contact.
2. Account A signed out completely.
3. Account B signed in and could not see Account A's contact.
4. Account B created and managed a separate contact.
5. Account B signed out; Account A signed back in and still saw only Account A's contact.
6. A read-only database verification found two authentication users, two contact rows, and two distinct `user_id` owners.

This boundary is enforced in Postgres rather than by hidden UI controls. The `contacts` table has forced Row Level Security with separate `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies. Every policy compares `auth.user_id()` with the row's `user_id`; insert and update also use `WITH CHECK`, preventing ownership reassignment.

## Secret-safety verification

- `.env.local` and development environment files are ignored by Git.
- The tracked `.env.example` contains placeholder public HTTPS endpoints only.
- `DATABASE_URL`, cookie secrets, session values, and test passwords are not present in this record or in frontend source code.
- Only the two browser-safe Neon Auth and Data API endpoint names use the `NEXT_PUBLIC_` prefix.

## Live application

[Open the production deployment](https://networking-tracker-iota-mauve.vercel.app)

The stable production origin is registered as a trusted Neon Auth origin. Full private-window production regression testing is performed in Phase 20.
