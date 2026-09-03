import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const { userId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "aud",
          product_data: { name: "Workboard Pro", description: "Unlimited boards and all features" },
          unit_amount: 900,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://whitebord-xi.vercel.app"}?upgrade=success&userId=${userId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://whitebord-xi.vercel.app"}?upgrade=cancelled`,
    metadata: { userId },
  });

  return NextResponse.json({ url: session.url });
}