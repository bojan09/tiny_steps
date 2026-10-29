"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { browserSupabase } from "@/lib/supabase/browser";
import { usePreferences, setAccountScope } from "@/lib/preferences";
import { defaults, sanitizePreferences } from "@/lib/preferences-model";
type Account = {
  id: string;
  email?: string;
  displayName: string;
  revision: number;
};
type Context = {
  account: Account | null;
  loading: boolean;
  message: string;
  reload: () => Promise<void>;
  saveName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
};
const AccountContext = createContext<Context | null>(null);
export function useAccount() {
  return useContext(AccountContext)!;
}
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null),
    [loading, setLoading] = useState(true),
    [message, setMessage] = useState(""),
    [bookmarks, setBookmarks] = useState<string[]>([]);
  const active = useRef<Account | null>(null),
    epoch = useRef(0),
    bookmarkRef = useRef<string[]>([]);
  const guestReady = useRef(false);
  const reload = useCallback(async () => {
    const generation = ++epoch.current;
    guestReady.current = false;
    active.current = null;
    setAccount(null);
    setLoading(true);
    setMessage("");
    setAccountScope(true);
    usePreferences.setState({
      preferences: { ...defaults },
      orientationStep: 0,
      orientationComplete: false,
    });
    bookmarkRef.current = [];
    setBookmarks([]);
    try {
      const response = await fetch("/api/account", { cache: "no-store" });
      if (generation !== epoch.current) return;
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (generation !== epoch.current) return;
      if (data.guest) {
        setAccountScope(false);
        await usePreferences.persist.rehydrate();
        if (generation !== epoch.current) return;
        guestReady.current = true;
        let guest: string[] = [];
        try {
          const raw = JSON.parse(
            localStorage.getItem("tinysteps-bookmarks-v1") || "[]",
          );
          if (Array.isArray(raw))
            guest = raw.filter((v) => typeof v === "string");
        } catch {}
        bookmarkRef.current = guest;
        setBookmarks(guest);
        setLoading(false);
        return;
      }
      usePreferences.setState({
        preferences: sanitizePreferences(data.preferences),
        orientationStep: data.progress?.step || 0,
        orientationComplete: data.progress?.completed === true,
      });
      const user = {
        id: data.id,
        email: data.email,
        displayName: data.displayName,
        revision: data.revision,
      };
      active.current = user;
      setAccount(user);
      bookmarkRef.current = data.bookmarks || [];
      setBookmarks(data.bookmarks || []);
      setLoading(false);
    } catch {
      if (generation === epoch.current) {
        setMessage(
          "Account connection unavailable. Reload your account to continue saving.",
        );
        setLoading(false);
      }
    }
  }, []);
  useEffect(() => {
    // Defer until the guest store has completed its initial hydration.
    const timer = setTimeout(() => void reload(), 0);
    const {
      data: { subscription },
    } = browserSupabase().auth.onAuthStateChange((event, session) => {
      if (
        (event === "SIGNED_IN" && session?.user.id !== active.current?.id) ||
        (event === "SIGNED_OUT" && active.current)
      )
        setTimeout(() => void reload(), 0);
    });
    const lifecycle = epoch;
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
      lifecycle.current++;
      active.current = null;
      setAccountScope(false);
    };
  }, [reload]);
  const update = useCallback(async (body: unknown) => {
    const user = active.current;
    if (!user) throw new Error("Your account is not ready.");
    const generation = epoch.current;
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-TinySteps-Account": user.id,
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (generation !== epoch.current) throw new Error("Account changed.");
    if (!response.ok)
      throw new Error(
        result.error || "Could not save. Reload your account to retry.",
      );
    return result;
  }, []);
  const accountId = account?.id;
  useEffect(() => {
    if (!accountId) return;
    let previous = usePreferences.getState(),
      timer: ReturnType<typeof setTimeout>,
      running = false,
      queued = false,
      stopped = false;
    const generation = epoch.current;
    async function flush() {
      if (running) {
        queued = true;
        return;
      }
      if (stopped || generation !== epoch.current || !active.current) return;
      running = true;
      const snapshot = usePreferences.getState();
      try {
        if (
          JSON.stringify(snapshot.preferences) !==
          JSON.stringify(previous.preferences)
        ) {
          setMessage("Saving your appearance…");
          const result = await update({
            kind: "preferences",
            preferences: snapshot.preferences,
            revision: active.current.revision,
          });
          if (generation !== epoch.current) return;
          active.current.revision = result.revision;
        }
        if (
          snapshot.orientationStep !== previous.orientationStep ||
          snapshot.orientationComplete !== previous.orientationComplete
        )
          await update({
            kind: "progress",
            step: snapshot.orientationStep,
            completed: snapshot.orientationComplete,
          });
        previous = snapshot;
        setMessage("Saved to your account.");
      } catch (error) {
        stopped = true;
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not save your changes.",
        );
      } finally {
        running = false;
        if (queued) {
          queued = false;
          void flush();
        }
      }
    }
    const unsubscribe = usePreferences.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(() => void flush(), 600);
    });
    return () => {
      stopped = true;
      clearTimeout(timer);
      unsubscribe();
    };
  }, [accountId, update]);
  async function saveName(displayName: string) {
    try {
      await update({ kind: "profile", displayName });
      if (active.current) {
        active.current = { ...active.current, displayName };
        setAccount(active.current);
      }
      setMessage("Profile saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save your name.",
      );
    }
  }
  async function signOut() {
    epoch.current++;
    active.current = null;
    setAccount(null);
    setAccountScope(true);
    usePreferences.setState({
      preferences: { ...defaults },
      orientationStep: 0,
      orientationComplete: false,
    });
    setBookmarks([]);
    const { error } = await browserSupabase().auth.signOut({ scope: "local" });
    if (error) setMessage("Sign-out could not finish. Please retry.");
    else await reload();
  }
  const bookmarkBusy = useRef(false);
  async function toggleBookmark(id: string) {
    if (loading || bookmarkBusy.current) return;
    const current = bookmarkRef.current,
      next = current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id];
    if (active.current) {
      bookmarkBusy.current = true;
      try {
        await update({
          kind: "bookmark",
          resourceId: id,
          saved: next.includes(id),
        });
        bookmarkRef.current = next;
        setBookmarks(next);
        setMessage("Bookmark saved.");
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Could not save bookmark.",
        );
      } finally {
        bookmarkBusy.current = false;
      }
    } else if (guestReady.current) {
      bookmarkRef.current = next;
      setBookmarks(next);
      try {
        localStorage.setItem("tinysteps-bookmarks-v1", JSON.stringify(next));
      } catch {
        setMessage("Bookmark available for this visit only.");
      }
    }
  }
  return (
    <AccountContext.Provider
      value={{
        account,
        loading,
        message,
        reload,
        saveName,
        signOut,
        bookmarks,
        toggleBookmark,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
