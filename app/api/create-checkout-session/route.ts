import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-08-26.dahlia" as any,
});

export async function POST(req: Request) {
  const { userId, email } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: "price_1UBTftPhHMuJiKoYIxkwPSHr", quantity: 1 }],
    customer_email: email,
    success_url: `https://whitebord-xi.vercel.app?upgrade=success&userId=${userId}`,
    cancel_url: `https://whitebord-xi.vercel.app?upgrade=cancelled`,
    metadata: { userId },
  });
  return NextResponse.json({ url: session.url });
}
