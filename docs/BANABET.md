# Banabet Quick wallet edition

A separate copy of the Liyubet application, restyled using Banabet navy (#172B40), black (#101010), and yellow (#FFCC00).

The public deposit/withdrawal directory, agent availability dashboard, and responsive backoffice share the Quick wallet visual language. Production assets are rebuilt from the Banabet source.

Use a separate application, database, Redis key prefix, application key, and Web Push keys when deploying Banabet. No live Liyubet data, accounts, credentials, or tokens were copied.

Fresh-install admin seed email is liyu@banabet.com. Run the admin seeder interactively with a strong password. Existing legacy configuration and widget identifiers remain compatible. Deploy migrations, initialize supported settings, and create the admin account before login.

This delivery changes branding and presentation. Existing backend transaction, reminder, pairing, and availability rules are preserved. Live database integration and notification delivery require verification in the Banabet deployment.

## Verification

TypeScript check and all 54 frontend tests passed. Backoffice, agent dashboard, and public widget production builds completed. Desktop and phone layout checks used sample API responses, with no document overflow observed on the overview, agent list, and agent dashboard. The Quick wallet language switch was corrected and inspected. Live database and notification integration have not been tested for a Banabet deployment. No Banabet repository has been uploaded or deployed.
