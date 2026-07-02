import { createAcoProfile } from "./actions";

export default function AcoPage() {
  return (
    <main className="page">
      <section className="page-heading">
        <p className="eyebrow">ACO profile vault</p>
        <h1>Store user-owned profile records safely.</h1>
        <p>
          This form stores encrypted non-payment profile fields tied to the logged-in user. It
          intentionally excludes card numbers, CVVs, and third-party account passwords.
        </p>
      </section>

      <form className="form-panel" action={createAcoProfile}>
        <label>
          Profile label
          <input name="displayName" placeholder="John Walmart profile" required />
        </label>
        <label>
          Retail account email
          <input name="retailEmail" type="email" placeholder="john@email.com" required />
        </label>
        <label>
          Shipping recipient
          <input name="shippingName" placeholder="John Doe" />
        </label>
        <label>
          Notes
          <textarea name="notes" placeholder="Internal notes, preferences, or non-sensitive hints." />
        </label>
        <button className="button dark" type="submit">
          Save encrypted profile
        </button>
      </form>
    </main>
  );
}
