const CACHE = "tinysteps-public-v2";
const PUBLIC = [
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon.svg",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const offline = await fetch("/offline", { cache: "reload" });
      if (!offline.ok) throw new Error("Offline page could not be prepared");
      const html = await offline.clone().text();
      // The offline route has its own Next.js chunks. Cache them before the
      // worker activates, even when this browser has never visited that route.
      const assets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
        .map(
          (match) =>
            new URL(match[1].replaceAll("&amp;", "&"), self.location.origin),
        )
        .filter(
          (url) =>
            url.origin === self.location.origin &&
            url.pathname.startsWith("/_next/static/"),
        )
        .map((url) => url.href);
      await cache.addAll([
        ...new Set([
          ...PUBLIC.filter((path) => path !== "/offline"),
          ...assets,
        ]),
      ]);
      await cache.put("/offline", offline);
    })(),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key.startsWith("tinysteps-public-") && key !== CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (
    req.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    req.headers.has("authorization")
  )
    return;
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match("/offline").then((hit) => hit || Response.error()),
      ),
    );
    return;
  }
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              event.waitUntil(
                caches.open(CACHE).then((cache) => cache.put(req, clone)),
              );
            }
            return response;
          }),
      ),
    );
  }
});
