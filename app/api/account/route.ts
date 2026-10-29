import { isSameAppOrigin } from "@/lib/request-origin";
import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";
import { validateAccountUpdate } from "@/lib/account-validation";
const reply = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store", Vary: "Cookie" },
  });
export async function GET() {
  const db = await serverSupabase();
  const {
    data: { user },
    error: authError,
  } = await db.auth.getUser();
  if (
    authError &&
    authError.name !== "AuthSessionMissingError" &&
    authError.status !== 401 &&
    authError.status !== 403
  )
    return reply(
      { error: "Account connection unavailable. Please retry." },
      503,
    );
  if (!user) return reply({ guest: true });
  const [profile, preferences, progress, bookmarks] = await Promise.all([
    db.from("profiles").select("display_name").eq("user_id", user.id).single(),
    db
      .from("user_preferences")
      .select("preferences,revision")
      .eq("user_id", user.id)
      .single(),
    db
      .from("learning_progress")
      .select("step,completed")
      .eq("user_id", user.id)
      .eq("lesson_id", "getting-started")
      .maybeSingle(),
    db.from("bookmarks").select("resource_id").eq("user_id", user.id),
  ]);
  if ([profile, preferences, progress, bookmarks].some((r) => r.error))
    return reply(
      { error: "Your account could not be loaded. Please retry." },
      503,
    );
  return reply({
    id: user.id,
    email: user.email,
    displayName: profile.data?.display_name,
    ...preferences.data,
    progress: progress.data,
    bookmarks: bookmarks.data?.map((b) => b.resource_id),
  });
}
export async function PATCH(request: NextRequest) {
  if (
    !isSameAppOrigin(request.headers.get("origin"), request.headers.get("host"))
  )
    return reply({ error: "Request not allowed." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 16384)
    return reply({ error: "Update too large." }, 413);
  let input;
  try {
    const raw = await request.text();
    if (raw.length > 16384) return reply({ error: "Update too large." }, 413);
    input = validateAccountUpdate(JSON.parse(raw));
  } catch {
    return reply({ error: "Invalid update." }, 400);
  }
  if (!input) return reply({ error: "Invalid update." }, 400);
  const db = await serverSupabase();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return reply({ error: "Please sign in again." }, 401);
  if (request.headers.get("X-TinySteps-Account") !== user.id)
    return reply({ error: "Your account changed. Reload before saving." }, 409);
  if (input.kind === "preferences") {
    const { data, error } = await db
      .from("user_preferences")
      .update({ preferences: input.preferences })
      .eq("user_id", user.id)
      .eq("revision", input.revision)
      .select("revision")
      .maybeSingle();
    if (error) return reply({ error: "Your changes could not be saved." }, 503);
    if (!data)
      return reply(
        {
          error:
            "Your appearance changed on another device. Reload your account before editing again.",
        },
        409,
      );
    return reply(data);
  }
  const result =
    input.kind === "profile"
      ? await db
          .from("profiles")
          .update({ display_name: input.displayName })
          .eq("user_id", user.id)
      : input.kind === "progress"
        ? await db.from("learning_progress").upsert({
            user_id: user.id,
            lesson_id: "getting-started",
            step: input.step,
            completed: input.completed,
          })
        : input.saved
          ? await db
              .from("bookmarks")
              .upsert({ user_id: user.id, resource_id: input.resourceId })
          : await db
              .from("bookmarks")
              .delete()
              .eq("user_id", user.id)
              .eq("resource_id", input.resourceId);
  return result.error
    ? reply({ error: "Your changes could not be saved." }, 503)
    : reply({ ok: true });
}
