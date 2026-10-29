import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { loadLocalEnv, safeFailure } from "./database.mjs";
loadLocalEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, process.env.SERVICE_ROLE_KEY, options);
const ids = [];
try {
  const clients = [];
  for (let i = 0; i < 2; i++) {
    const email = "tinysteps-test-" + randomUUID() + "@example.invalid",
      password = randomUUID() + randomUUID();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    assert.equal(error, null);
    ids.push(data.user.id);
    const client = createClient(
      url,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      options,
    );
    assert.equal(
      (await client.auth.signInWithPassword({ email, password })).error,
      null,
    );
    clients.push(client);
  }
  const [a, b] = clients;
  assert.equal((await a.from("profiles").select("*")).data.length, 1);
  assert.equal(
    (await b.from("profiles").select("*").eq("user_id", ids[0])).data.length,
    0,
  );
  assert.ok(
    (
      await b
        .from("bookmarks")
        .insert({ user_id: ids[0], resource_id: "forbidden" })
    ).error,
  );
  assert.equal(
    (
      await b
        .from("profiles")
        .update({ display_name: "forbidden" })
        .eq("user_id", ids[0])
        .select()
    ).data.length,
    0,
  );
  assert.equal(
    (
      await a
        .from("profiles")
        .update({ display_name: "Owner" })
        .eq("user_id", ids[0])
    ).error,
    null,
  );
  assert.ok(
    (await a.from("profiles").update({ user_id: ids[1] }).eq("user_id", ids[0]))
      .error,
  );
  const first = await a.from("user_preferences").select("revision").single();
  assert.equal(first.error, null);
  const updated = await a
    .from("user_preferences")
    .update({ preferences: { theme: "ocean" } })
    .eq("revision", first.data.revision)
    .select("revision")
    .single();
  assert.equal(updated.error, null);
  assert.equal(updated.data.revision, first.data.revision + 1);
  assert.equal(
    (
      await a
        .from("user_preferences")
        .update({ preferences: { theme: "rose" } })
        .eq("revision", first.data.revision)
        .select()
    ).data.length,
    0,
  );
  assert.ok((await a.from("user_preferences").update({ revision: 1 })).error);
  assert.ok(
    (
      await a
        .from("achievements")
        .insert({ user_id: ids[0], achievement_id: "forged" })
    ).error,
  );
  const anon = createClient(
    url,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    options,
  );
  for (const table of [
    "profiles",
    "user_preferences",
    "learning_progress",
    "bookmarks",
    "achievements",
    "optional_child_context",
    "ai_usage",
  ]) {
    assert.ok((await anon.from(table).select("*")).error);
    const result = await b.from(table).select("*").eq("user_id", ids[0]);
    assert.equal(result.error, null);
    assert.equal(result.data.length, 0);
  }
  assert.ok((await anon.rpc("tinysteps_healthcheck")).error);
  console.log(
    "PASS: owner access, cross-account isolation, anonymous denial, immutable identity, revision conflict and protected awards.",
  );
} catch (error) {
  safeFailure(error);
} finally {
  for (const id of ids) {
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) {
      console.error("Test identity cleanup failed.");
      process.exitCode = 1;
    }
  }
  console.log("Disposable test identities cleaned up.");
}
