import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as Blob;
    if (!audio) return NextResponse.json({ error: "No audio" }, { status: 400 });

    const groqForm = new FormData();
    const ext = audio.type.includes("mp4") ? "mp4" : audio.type.includes("ogg") ? "ogg" : "webm";
    groqForm.append("file", audio, `audio.${ext}`);
    groqForm.append("model", "whisper-large-v3-turbo");
    groqForm.append("response_format", "text");

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY?.trim()}` },
      body: groqForm,
    });

    const transcript = await res.text();
    if (!res.ok) return NextResponse.json({ error: transcript }, { status: 502 });
    return NextResponse.json({ transcript });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
