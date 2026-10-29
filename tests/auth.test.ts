import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validDisplayName,
  validateAccountUpdate,
} from "../lib/account-validation.ts";
test("rejects malformed preferences updates and stale revision shapes", () => {
  for (const v of [
    null,
    [],
    {},
    { kind: "preferences", revision: -1, preferences: {} },
    { kind: "preferences", revision: 1, preferences: "bad" },
  ])
    assert.equal(validateAccountUpdate(v), null);
});
test("accepts bounded profile names without control characters", () => {
  assert.equal(validDisplayName(" Emma "), "Emma");
  assert.equal(validDisplayName("a".repeat(81)), null);
  assert.equal(validDisplayName("a\nb"), null);
});
test("never accepts a client supplied user identity", () => {
  assert.equal(
    validateAccountUpdate({
      kind: "profile",
      displayName: "A",
      user_id: "other",
    }),
    null,
  );
});

import { isSameAppOrigin, appOriginForHost } from "../lib/request-origin.ts";
test("trusted public and local origins match the request host", () => {
  assert.equal(
    isSameAppOrigin("http://127.0.0.1:3000", "127.0.0.1:3000"),
    true,
  );
  assert.equal(
    isSameAppOrigin(
      "https://tiny-steps-six.vercel.app",
      "tiny-steps-six.vercel.app",
    ),
    true,
  );
  assert.equal(
    isSameAppOrigin("https://evil.example", "127.0.0.1:3000"),
    false,
  );
  assert.equal(appOriginForHost("evil.example"), undefined);
});
