// Keep the app usable when browser privacy settings or quota block persistence.
function unavailable() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("tinysteps-storage-unavailable"));
}
export const browserStorage = {
  getItem(key: string): string | null {
    try {
      return typeof window === "undefined"
        ? null
        : window.localStorage.getItem(key);
    } catch {
      unavailable();
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      unavailable();
    }
  },
  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      unavailable();
    }
  },
};
