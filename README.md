# BUFALOMUN’26

The official site for the second session of Buca Science High School Model United Nations. It uses Next.js 16, PostgreSQL through Prisma, Resend verification emails, Google Sheets application delivery, Upstash rate limiting, and Vercel Blob uploads.

## Local development

1. Copy `.env.example` to `.env.local` and fill the service credentials.
2. Run `pnpm install` and `pnpm prisma:generate`.
3. Apply the initial Prisma migration to Supabase with a direct database URL.
4. Run `pnpm dev`.

Create `ADMIN_PASSWORD_HASH` as `salt:hexhash`, where the hash is a 64-byte Node.js `scrypt` result. `ADMIN_SESSION_SECRET` and `APPLICATION_CODE_SECRET` should each be long random values. Share every configured Google Sheet with `GOOGLE_SERVICE_ACCOUNT_EMAIL`; submissions go to a tab named `Applications`.

## Checks

Run `pnpm typecheck`, `pnpm test`, `pnpm lint`, and `pnpm build` before deployment. The public site uses built-in conference settings before the database is connected; applications and administration require the configured services.
