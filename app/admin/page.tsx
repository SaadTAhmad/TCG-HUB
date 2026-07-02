export default function AdminPage() {
  return (
    <main className="page">
      <section className="page-heading">
        <p className="eyebrow">Admin dashboard</p>
        <h1>Operations control center.</h1>
        <p>
          Wire this page to Discord role checks before exposing member management, subscription
          events, proxy inventory, and order tracking jobs.
        </p>
      </section>
      <section className="metric-grid">
        <article>
          <span>Members</span>
          <strong>Supabase</strong>
        </article>
        <article>
          <span>Billing</span>
          <strong>Stripe webhooks</strong>
        </article>
        <article>
          <span>Role sync</span>
          <strong>Discord bot</strong>
        </article>
      </section>
    </main>
  );
}
