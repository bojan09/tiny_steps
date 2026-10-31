import { test } from "node:test";
import assert from "node:assert/strict";
import { matchesReleaseVersion } from "../scripts/release-markers.mjs";

test("deployed-version check accepts React text markers and inline markup", () => {
  for (const html of [
    "<p>Version <!-- -->1.5.3</p>",
    "<p>Version <span>1.5.3</span></p>",
    "<p>Version&nbsp;1.5.3</p>",
  ]) {
    assert.equal(matchesReleaseVersion(html, "1.5.3"), true);
  }
});
test("deployed-version check rejects stale versions and script-only matches", () => {
  for (const html of [
    "<p>Version 1.5.2</p>",
    "<p>Version 1.5.30</p>",
    '<script>const text="Version 1.5.3"</script>',
    "<!-- Version 1.5.3 -->",
  ]) {
    assert.equal(matchesReleaseVersion(html, "1.5.3"), false);
  }
});
