import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const key = process.env.GROQ_API_KEY;
    if (!key) return NextResponse.json({ summary: "No API key found" });

    const { boardName, ideas } = await req.json();
    const ideasText = ideas.map((i: any) => `- [${i.label}] ${i.text}`).join("\n");
    const prompt = `You are a meeting assistant. Summarise this board called "${boardName}" into a concise meeting summary with key points, decisions, action items, and blockers. Ideas:\n${ideasText}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key.trim()}`,
      },
      body: JSON.stringify({
        model: "groq/compound",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (data.error) return NextResponse.json({ summary: "Error: " + data.error.message });
    const summary = data.choices?.[0]?.message?.content || "Could not generate summary.";
    return NextResponse.json({ summary });
  } catch (err: any) {
    return NextResponse.json({ summary: "Exception: " + err.message });
  }
}
