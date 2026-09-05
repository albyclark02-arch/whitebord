import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qhmipgdtemabmqhhjbeb.supabase.co",
  process.env.SUPABASE_SERVICE_KEY || ""
);

export async function POST(req: Request) {
  try {
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
