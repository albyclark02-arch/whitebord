import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { boardName, ideas } = await req.json();
    
    const ideasText = ideas.map((i: any) => `- [${i.label}] ${i.text}`).join("\n");
    const prompt = `You are a meeting assistant. Summarise this board called "${boardName}" into a concise meeting summary with key points, decisions, action items, and blockers. Ideas:\n${ideasText}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const summary = data.content?.[0]?.text || "Could not generate summary.";
    return NextResponse.json({ summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
