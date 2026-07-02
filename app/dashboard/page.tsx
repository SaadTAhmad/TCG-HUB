import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  const discordName =
    user?.externalAccounts.find((account) => account.provider === "oauth_discord")?.username ??
    user?.username ??
    "member";

  return (
    <main className="page">
      <section className="page-heading">
        <p className="eyebrow">Member dashboard</p>
        <h1>Welcome, @{discordName}</h1>
        <p>Your records stay scoped to your authenticated Clerk/Discord identity.</p>
      </section>

      <section className="metric-grid">
        <article>
          <span>Subscription</span>
          <strong>Pending sync</strong>
        </article>
        <article>
          <span>Discord access</span>
          <strong>Role check ready</strong>
        </article>
        <article>
          <span>ACO profiles</span>
          <strong>User-owned</strong>
        </article>
      </section>

      <section className="two-column">
        <article className="panel">
          <h2>Next actions</h2>
          <div className="stack">
            <Link className="row-link" href="/aco">
              Add a safe ACO profile
            </Link>
            <Link className="row-link" href="/api/stripe/checkout">
              Start Stripe checkout
            </Link>
          </div>
        </article>
        <article className="panel warning">
          <h2>Payment data boundary</h2>
          <p>
            Do not store raw card numbers, expiration dates, or CVVs in this app. Stripe should
            tokenize and store payment methods.
          </p>
        </article>
      </section>
    </main>
  );
}
