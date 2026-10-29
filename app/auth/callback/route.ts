import { appOriginForHost } from "@/lib/request-origin";
import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const origin = appOriginForHost(request.headers.get("host"));
  if (!origin) return new NextResponse("Unknown app origin", { status: 400 });
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await serverSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(new URL("/profile", origin), {
        headers: { "Cache-Control": "private, no-store" },
      });
  }
  return NextResponse.redirect(new URL("/profile?auth=failed", origin), {
    headers: { "Cache-Control": "private, no-store" },
  });
}
