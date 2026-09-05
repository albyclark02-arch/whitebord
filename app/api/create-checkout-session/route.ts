import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return NextResponse.json({ error: "No Stripe key" }, { status: 500 });

    const { userId, email } = await req.json();

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        mode: "subscription",
        "line_items[0][price]": "price_1UBTftPhHMuJiKoYIxkwPSHr",
        "line_items[0][quantity]": "1",
        customer_email: email,
        success_url: `https://whitebord-xi.vercel.app?upgrade=success&userId=${userId}`,
        cancel_url: `https://whitebord-xi.vercel.app?upgrade=cancelled`,
        "metadata[userId]": userId,
      }).toString(),
    });

    const session = await res.json();
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
