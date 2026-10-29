"use client";
import { useState, useSyncExternalStore } from "react";
import { useAccount } from "./account-provider";
import { browserSupabase } from "@/lib/supabase/browser";
export function ProfilePanel() {
  const { account, loading, message, reload, saveName, signOut } = useAccount();
  const [name, setName] = useState(""),
    [editing, setEditing] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function signIn() {
    setBusy(true);
    setError("");
    const { error } = await browserSupabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/auth/callback" },
    });
    if (error) {
      setError("Google sign-in could not start. Please try again.");
      setBusy(false);
    }
  }
  return (
    <section className="paper profile-panel">
      {loading ? (
        <p role="status">Opening your little corner…</p>
      ) : account ? (
        <>
          <h2>Welcome, {account.displayName || "caregiver"}.</h2>
          <p>{account.email}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void saveName(name);
              setEditing(false);
            }}
          >
            <label htmlFor="display-name">What should we call you?</label>
            <input
              id="display-name"
              maxLength={80}
              value={editing ? name : account.displayName}
              onChange={(e) => {
                setEditing(true);
                setName(e.target.value);
              }}
              autoComplete="nickname"
            />
            <button className="button primary" disabled={!editing}>
              Save name
            </button>
          </form>
          <p>
            Your appearance, bookmarks and introduction progress are saved to
            your account. Guest choices stay separate on this device.
          </p>
          <button className="button secondary" onClick={() => void signOut()}>
            Sign out
          </button>
        </>
      ) : (
        <>
          <h2>Welcome, caregiver.</h2>
          <p>
            Explore freely, or sign in to bring your appearance, bookmarks and
            progress with you.
          </p>
          <button
            className="button primary"
            disabled={busy}
            onClick={() => void signIn()}
          >
            {busy ? "Opening Google…" : "Continue with Google"}
          </button>
          <p>
            Your guest choices stay on this device. Signing in opens your
            account’s own settings.
          </p>
        </>
      )}
      <p role="status">{error || message}</p>
      {message && (
        <button className="text-link" onClick={() => void reload()}>
          Reload account
        </button>
      )}
      <CallbackNotice />
    </section>
  );
}
function CallbackNotice() {
  const failed = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("auth") === "failed",
    () => false,
  );
  return failed ? (
    <p role="alert">
      Sign-in was not completed. Please try Continue with Google again.
    </p>
  ) : null;
}
