import Link from "next/link";

export default function HomePage() {
  return (
    <main className="hero-page">
      <section className="hero-panel">
        <p className="eyebrow">Private Discord member portal</p>
        <h1>ACO operations, proxy access, billing, and order records.</h1>
        <p>
          A production-ready direction for TCG Hub: Discord login through Clerk, app data in
          Supabase, subscriptions in Stripe, and role automation through your Discord bot.
        </p>
        <div className="actions">
          <Link className="button dark" href="/dashboard">
            Open dashboard
          </Link>
          <Link className="button light" href="/aco">
            Manage ACO profiles
          </Link>
        </div>
      </section>
    </main>
  );
}
