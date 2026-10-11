# October 2026 interface redesign

## Delivered

The backoffice uses a new charcoal, lime, teal, and orange visual system with a light theme. Navigation is grouped into Operations, Insights, and Configuration. Desktop users have a sidebar and searchable page finder; phone users have bottom navigation and a sliding menu.

The overview shows API statistics, expiring availability, agent status, and CSV export. Agent management defaults to cards with status filters; phones always use cards. Payment methods and communications adapt to labeled mobile records. Settings exposes supported configuration and account controls. Analytics screens share the new shell and chart colors.

Interface behavior includes deliberate duration selection before going online, keyboard-accessible menus and dialogs, persisted theme and list preferences, partial-fetch error feedback, page-level recovery, and lazy loading of backoffice routes.

The public widget uses Quick wallet. The agent dashboard uses Mobile companion. Public branding reads Banabet; fresh admin seeds use Liyu.

## Compatibility and scope

This is an interface and frontend interaction redesign. Authentication, transaction eligibility, availability rules, reminder scheduling, pairing, and API routes use the existing backend. Earlier backend security findings are not represented as fixed by this work.

Legacy configuration keys, environment prefixes, browser-storage identifiers, and the original widget container remain supported. Existing database credentials, tokens, and business rules are preserved. Existing records are not renamed automatically. A stored user name of Kidus displays as Liyu; other user names are retained.

## Validation

- TypeScript check passed.
- 54 frontend tests passed across 11 files.
- Backoffice, agent dashboard, and public embed production builds passed.
- 139 PHP files passed syntax checks.
- All 11 backoffice routes checked at 1440px, 390px, and 320px, without document overflow or render errors.
- Mobile drawer, create-agent entry, CSV download, and light theme verified.
- Login, agent dashboard, and Amharic public widget visually inspected.

Browser checks used sample API responses. Real database writes, Telegram delivery, Web Push delivery, and database-backed Laravel tests require a configured environment. Nothing has been deployed or uploaded to GitHub.
