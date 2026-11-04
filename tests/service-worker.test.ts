import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
type WorkerEvent = {
  waitUntil: (promise: Promise<unknown>) => void;
  request?: Request;
  respondWith?: (promise: Promise<Response>) => void;
};
const source = await readFile(
  new URL("../public/sw.js", import.meta.url),
  "utf8",
);
function harness() {
  const handlers: Record<string, (event: WorkerEvent) => void> = {};
  const entries = new Map<string, Map<string, Response>>();
  const requests: string[] = [];
  const origin = "https://example.test";
  const key = (request: string | Request) =>
    new URL(typeof request === "string" ? request : request.url, origin).href;
  const caches = {
    open: async (name: string) => {
      if (!entries.has(name)) entries.set(name, new Map());
      const map = entries.get(name)!;
      return {
        addAll: async (paths: string[]) => {
          for (const path of paths) map.set(key(path), new Response("asset"));
        },
        put: async (req: string | Request, response: Response) => {
          map.set(key(req), response);
        },
        match: async (req: string | Request) => map.get(key(req))?.clone(),
      };
    },
    keys: async () => [...entries.keys()],
    delete: async (name: string) => entries.delete(name),
  };
  let fail = false;
  vm.runInNewContext(source, {
    self: {
      location: { origin },
      clients: { claim: async () => {} },
      addEventListener: (
        type: string,
        handler: (event: WorkerEvent) => void,
      ) => {
        handlers[type] = handler;
      },
    },
    caches,
    URL,
    Response,
    fetch: async (req: string | Request) => {
      requests.push(key(req));
      if (fail) throw Error("offline");
      return new Response('<script src="/_next/static/offline.js"></script>', {
        status: 200,
      });
    },
  });
  async function lifecycle(type: string) {
    let promise: Promise<unknown> | undefined;
    handlers[type]({
      waitUntil: (p: Promise<unknown>) => {
        promise = p;
      },
    });
    await promise;
  }
  function fetchRequest(
    path: string,
    options: RequestInit = {},
    mode = "cors",
  ) {
    const req = new Request(new URL(path, origin), options);
    Object.defineProperty(req, "mode", { value: mode });
    let response: Promise<Response> | undefined;
    handlers.fetch({
      request: req,
      respondWith: (p: Promise<Response>) => {
        response = p;
      },
      waitUntil: () => {},
    });
    return response;
  }
  return {
    entries,
    requests,
    caches,
    lifecycle,
    fetchRequest,
    setOffline: () => {
      fail = true;
    },
  };
}
test("worker prepares only public offline content and never handles private/API/auth/authorized requests", async () => {
  const h = harness();
  await h.lifecycle("install");
  const keys = [...h.entries.values()].flatMap((e) => [...e.keys()]);
  assert.ok(keys.includes("https://example.test/offline"));
  assert.ok(keys.includes("https://example.test/_next/static/offline.js"));
  assert.ok(!keys.some((x) => /profile|api|auth/.test(x)));
  for (const path of ["/api/account", "/auth/callback?code=secret"])
    assert.equal(h.fetchRequest(path, {}, "navigate"), undefined);
  assert.equal(
    h.fetchRequest("/icons/icon.svg", {
      headers: { Authorization: "Bearer private" },
    }),
    undefined,
  );
  assert.equal(
    h.fetchRequest("/api/account", { method: "PATCH", body: "private" }),
    undefined,
  );
  assert.equal(h.fetchRequest("/icons/icon.svg?token=private"), undefined);
  assert.equal(h.fetchRequest("https://another.test/resource"), undefined);
  h.setOffline();
  assert.ok((await h.fetchRequest("/profile", {}, "navigate"))?.ok);
});
test("activation cleans only old TinySteps caches and a failed install cannot replace the working fallback", async () => {
  const h = harness();
  await h.lifecycle("install");
  await h.caches.open("tinysteps-public-old");
  await h.caches.open("other-app");
  await h.lifecycle("activate");
  assert.ok(!h.entries.has("tinysteps-public-old"));
  assert.ok(h.entries.has("other-app"));
  h.setOffline();
  await assert.rejects(h.lifecycle("install"));
  assert.ok((await h.fetchRequest("/anything", {}, "navigate"))?.ok);
});
