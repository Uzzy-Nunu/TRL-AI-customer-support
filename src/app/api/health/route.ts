import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/supabase";

export function GET() {
  return NextResponse.json({ status: "ok", aiConfigured: Boolean(process.env.GEMINI_API_KEY), persistence: hasSupabaseConfig() ? "supabase" : "development-memory" });
}
