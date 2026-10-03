import { NextResponse } from "next/server";

const TYPES = ["task", "decision", "blocker", "question", "idea"];

const SYSTEM_PROMPT = `You turn a short chunk of a live meeting transcript into sticky notes for a shared board. Return JSON: {"stickies":[{"type":"task"|"decision"|"blocker"|"question"|"idea","text":"..."}]}. Rules: only include things actually said that matter (tasks with owner if named, decisions made, blockers/risks, open questions, notable ideas). Each text under 15 words, written as a clear note. Skip small talk, filler and anything already on the board. If nothing is worth a note, return {"stickies":[]}.`;

export async function POST(req: Request) {
  try {
    const key = process.env.GROQ_API_KEY;
    if (!key) return NextResponse.json({ error: "No API key found" }, { status: 500 });

    const { transcript, existing } = await req.json();
    if (!transcript?.trim()) return NextResponse.json({ stickies: [] });
    const existingText = (existing || []).slice(-50).map((t: string) => `- ${t}`).join("\n") || "(nothing yet)";

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key.trim()}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        reasoning_effort: "low",
        max_tokens: 800,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Already on the board:\n${existingText}\n\nNew transcript chunk:\n${transcript}` },
        ],
      }),
    });

    const data = await res.json();
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 502 });
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    const stickies = (parsed.stickies || []).filter((s: any) => TYPES.includes(s?.type) && typeof s.text === "string" && s.text.trim());
    return NextResponse.json({ stickies });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
