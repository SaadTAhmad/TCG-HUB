# TCG Hub Portal Roadmap

## Recommended Stack

- Next.js on Vercel for the web app and API routes.
- Clerk for Discord OAuth login.
- Supabase Postgres for application records.
- Supabase RLS keyed to the Clerk user id for user-owned rows.
- Stripe Checkout and Billing Portal for subscriptions and payment methods.
- Discord bot for guild membership checks and paid-role grant/removal.
- Resend for transactional emails.
- PostHog for product analytics and Sentry for error tracking.
- Upstash only when queueing, rate limits, or distributed locks are needed.
- Pinecone is not needed for the first version unless you are adding semantic search or AI retrieval.

## Non-Negotiable Data Boundary

Do not store raw card numbers, CVVs, or third-party account passwords in this app.

Use Stripe-hosted Checkout, Stripe Elements, or Setup Intents for payment methods. In your database, store only Stripe customer ids, subscription ids, payment method ids, brand, last four, and expiration metadata returned by Stripe.

For ACO profile records, store only fields that are required for the portal workflow. Sensitive non-payment fields should be encrypted before insertion and decrypted only on the server for the owner or authorized admin workflow.

## Build Order

1. Create Clerk app and enable Discord OAuth.
2. Create Supabase project and run `supabase/schema.sql`.
3. Configure Clerk JWT/Supabase integration so RLS can read the Clerk user id.
4. Add profile sync from Clerk webhooks.
5. Add Stripe Checkout and webhook subscription updates.
6. Store Discord user ids from Clerk external accounts.
7. Grant/remove paid Discord roles from Stripe subscription changes.
8. Add the ACO profile CRUD views.
9. Add proxy order tables and provider integrations.
10. Add email order tracking with explicit mailbox consent and provider-safe APIs.
11. Add admin dashboard role checks.
12. Add Sentry and PostHog instrumentation.

## Environment Setup

Copy `.env.example` to `.env.local` and fill in each provider key.

Generate the encryption key with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Run locally with:

```powershell
npm install
npm run dev
```

Then open `http://localhost:3000`.
