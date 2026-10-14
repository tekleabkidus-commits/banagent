# Ethiopian payment options

Run `php artisan db:seed --class=EthiopianPaymentMethodSeeder --force` after deployment.

Adds or activates 40 options: 32 banks and eight wallets. Existing IDs, custom names, icons, display order, and agent assignments are preserved. Matching deleted entries are restored. Repeated runs do not create duplicates for matching slugs or case-insensitive exact names. This seeder does not seed admins, sample agents, or settings.

An active option is available for assignment in the backoffice. Agents must be assigned the deposit/withdrawal methods they actually support. Adding options does not integrate payment APIs or establish provider acceptance of transactions.

Bank directory source: https://nbe.gov.et/summary-of-banks-foreign-exchange-related-fees-and-charges/

Commercialized mobile issuers: https://nbe.gov.et/payment-instrument-issuers-system-operators/

Bank-backed wallet sources: https://ebirr.com/services , https://dashenbanksc.com/customer-knowledge-center/ , https://portal.hellocash.net/

Catalog reviewed October 14, 2026. Payment gateways, national switches, and pilot-only issuers are not bank/wallet options in this catalog.
