import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return NextResponse.json({ error: "No Supabase service key" }, { status: 500 });
    const supabase = createClient("https://qhmipgdtemabmqhhjbeb.supabase.co", key);

    const body = await req.json();
    if (body.type === "checkout.session.completed") {
      const userId = body.data.object.metadata?.userId;
      if (userId) {
        await supabase.from("profiles").upsert({ id: userId, is_pro: true });
      }
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
