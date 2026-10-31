import test from "node:test";
import assert from "node:assert/strict";
import { readSupabaseConfig } from "../lib/supabase/config.ts";
test("missing or invalid deployment settings disable accounts safely", () => {
  for (const [url, key] of [
    [undefined, undefined],
    ["https://example.supabase.co", undefined],
    [undefined, "public-test-key"],
    [" ", "public-test-key"],
    ["invalid", "public-test-key"],
    ["file:///private", "public-test-key"],
  ])
    assert.equal(readSupabaseConfig(url, key), null);
});
test("public deployment settings are normalized without hard-coded credentials", () => {
  assert.deepEqual(
    readSupabaseConfig(" https://example.supabase.co ", " public-test-key "),
    { url: "https://example.supabase.co", key: "public-test-key" },
  );
});
