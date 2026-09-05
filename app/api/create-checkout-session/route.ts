import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return NextResponse.json({ error: "No Stripe key found" }, { status: 500 });
    
    const stripe = new Stripe(key, { apiVersion: "2026-08-26.dahlia" as any });
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
