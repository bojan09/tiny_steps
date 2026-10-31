import "server-only";
import { createServerClient } from "@supabase/ssr";
import { supabaseConfig } from "./config";
import { cookies } from "next/headers";
export async function serverSupabase() {
  const config = supabaseConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        for (const { name, value, options } of values)
          jar.set(name, value, options);
      },
    },
  });
}
