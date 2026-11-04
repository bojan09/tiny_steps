"use client";
import { Localize } from "@/components/localize";
import { useState, useSyncExternalStore } from "react";
import { useAccount } from "./account-provider";
import { browserSupabase } from "@/lib/supabase/browser";
export function ProfilePanel() {
  const {
    account,
    loading,
    message,
    reload,
    saveName,
    signOut,
    authAvailable,
  } = useAccount();
  const [name, setName] = useState(""),
    [editing, setEditing] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function signIn() {
    setBusy(true);
    setError("");
    const client = browserSupabase();
    if (!client) {
      setError("Account sign-in is temporarily unavailable.");
      setBusy(false);
      return;
    }
    const { error } = await client.auth.signInWithOAuth({
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
        <p role="status">
          <Localize>{"Opening your little corner\u2026"}</Localize>
        </p>
      ) : account ? (
        <>
          <h2>
            <Localize>{"Welcome, "}</Localize>
            {account.displayName || <Localize>caregiver</Localize>}.
          </h2>
          <p>{account.email}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void saveName(name);
              setEditing(false);
            }}
          >
            <label htmlFor="display-name">
              <Localize>{"What should we call you?"}</Localize>
            </label>
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
              <Localize>{"Save name"}</Localize>
            </button>
          </form>
          <p>
            <Localize>
              {
                "Your appearance, bookmarks and introduction progress are saved to your account. Guest choices stay separate on this device."
              }
            </Localize>
          </p>
          <button className="button secondary" onClick={() => void signOut()}>
            <Localize>{"Sign out"}</Localize>
          </button>
        </>
      ) : (
        <>
          <h2>
            <Localize>{"Welcome, caregiver."}</Localize>
          </h2>
          <p>
            <Localize>
              {
                "Explore freely, or sign in to bring your appearance, bookmarks and progress with you."
              }
            </Localize>
          </p>
          <button
            className="button primary"
            disabled={busy || !authAvailable}
            onClick={() => void signIn()}
          >
            <Localize>
              {busy ? "Opening Google…" : "Continue with Google"}
            </Localize>
          </button>
          <p>
            <Localize>
              {
                "Your guest choices stay on this device. Signing in opens your account\u2019s own settings."
              }
            </Localize>
          </p>
        </>
      )}
      <p role="status">
        <Localize>{error || message}</Localize>
      </p>
      <Localize>
        {message && (
          <button className="text-link" onClick={() => void reload()}>
            <Localize>{"Reload account"}</Localize>
          </button>
        )}
      </Localize>
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
      <Localize>
        {"Sign-in was not completed. Please try Continue with Google again."}
      </Localize>
    </p>
  ) : null;
}
