import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const priceId = process.env.STRIPE_PRICE_ID;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!appUrl || !priceId || !secretKey) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/dashboard?checkout=cancelled`,
    client_reference_id: userId,
    metadata: {
      clerkUserId: userId,
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
  }

  return NextResponse.redirect(session.url);
}
