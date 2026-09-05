import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return NextResponse.json({ error: "No Stripe key" }, { status: 500 });

    const { userId, email } = await req.json();

    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("line_items[0][price]", "price_1UBTftPhHMuJiKoYIxkwPSHr");
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `https://whitebord-xi.vercel.app?upgrade=success&userId=${userId}`);
    params.append("cancel_url", `https://whitebord-xi.vercel.app?upgrade=cancelled`);
    if (email) params.append("customer_email", email);
    params.append("metadata[userId]", userId);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await res.json();
    console.log("Stripe session:", JSON.stringify(session));
    if (session.url) return NextResponse.json({ url: session.url });
    return NextResponse.json({ error: session.error?.message || "Unknown error" }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
