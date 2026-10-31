export function readSupabaseConfig(
  url: string | undefined,
  key: string | undefined,
) {
  if (!url?.trim() || !key?.trim()) return null;
  try {
    const parsed = new URL(url.trim());
    if (!["https:", "http:"].includes(parsed.protocol)) return null;
  } catch {
    return null;
  }
  return { url: url.trim(), key: key.trim() };
}

// Direct references are required for Next.js to include public build-time values.
export function supabaseConfig() {
  return readSupabaseConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
