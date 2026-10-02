import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();
    
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "groq/compound",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `Extract the 3-5 most important points from this meeting transcript. Return ONLY a JSON array of strings, no other text. Example: ["Point 1", "Point 2"]\n\nTranscript: ${transcript}`
        }],
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    const points = JSON.parse(content.match(/\[.*\]/s)?.[0] || "[]");
    return NextResponse.json({ points });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
