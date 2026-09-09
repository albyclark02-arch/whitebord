import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return NextResponse.json({ summary: "No API key found" });

    const { boardName, ideas } = await req.json();
    const ideasText = ideas.map((i: any) => `- [${i.label}] ${i.text}`).join("\n");
    const prompt = `You are a meeting assistant. Summarise this board called "${boardName}" into a concise meeting summary with key points, decisions, action items, and blockers. Ideas:\n${ideasText}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key.trim(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (data.error) return NextResponse.json({ summary: "Anthropic error: " + data.error.message });
    const summary = data.content?.[0]?.text || "Could not generate summary.";
    return NextResponse.json({ summary });
  } catch (err: any) {
    return NextResponse.json({ summary: "Exception: " + err.message });
  }
}
