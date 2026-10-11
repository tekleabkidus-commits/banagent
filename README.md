# Banabet Agents

Laravel 11 service with a React backoffice, mobile agent dashboard, and public deposit/withdrawal widget.

The redesign delivers a responsive backoffice, Quick wallet widget, and Mobile companion dashboard. See [redesign notes](docs/REDESIGN.md).

## Setup

Requires PHP 8.2+, Composer, Node.js/npm, PostgreSQL, and Redis.

1. Run `composer install` and `npm ci`.
2. Copy `.env.example` to `.env`; configure database, Redis, application URL, allowed origins, and Web Push keys.
3. Run `php artisan key:generate` for a new installation. Preserve the existing application key when upgrading.
4. Back up any existing database, then run `php artisan migrate`.
5. For a new installation, run seeders interactively and choose your own admin password. The inherited admin seeder has a default-password fallback in non-interactive mode; do not use that fallback for deployment. Existing installations retain existing accounts.
6. Run `npm run check` to type-check, test, and build all frontend applications.
7. Serve Laravel with the web root pointing to `public`. Configure the queue worker and Laravel scheduler for reminders and background work.

The delivery ZIP includes compiled frontend assets. Composer dependencies and server configuration still need installation on the target server.

## Interfaces

- `/admin`: backoffice with existing authentication and APIs.
- Personal agent links: availability, withdrawal capacity, and reminders.
- Public widget: add a `banabet-agents` container and use the embed script URL from Settings. The original container remains supported.

Internal legacy configuration and browser-storage identifiers remain compatible with existing installations.

## Verification

TypeScript passed, 54 frontend tests passed, and production builds completed. 139 PHP files passed syntax checks. Browser checks covered 11 backoffice routes at 1440px, 390px, and 320px, plus login, agent, and widget previews.

Browser verification used sample API responses. Database-backed Laravel integration tests and live deployment verification remain outstanding.
