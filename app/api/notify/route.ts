import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { boardName, editorEmail, ownerEmail } = await req.json();
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Workboard <notifications@workboard.app>",
        to: ownerEmail,
        subject: `Someone edited your board: ${boardName}`,
        html: `<p>Hi,</p><p><strong>${editorEmail}</strong> just added an idea to your board <strong>${boardName}</strong> on Workboard.</p><p><a href="https://whitebord-xi.vercel.app">View board →</a></p>`,
      }),
    });

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
