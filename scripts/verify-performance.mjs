import { chromium } from "playwright";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
const root = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const base = new URL(
  process.env.TINYSTEPS_TEST_BASE_URL || "http://127.0.0.1:3000",
);
if (
  base.protocol !== "http:" ||
  !["127.0.0.1", "localhost"].includes(base.hostname)
)
  throw new Error(
    "This performance runner is restricted to the local development server.",
  );
const browser = await chromium.launch({
  executablePath:
    process.env.TINYSTEPS_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  headless: true,
});
const report = {
  checkedAt: new Date().toISOString(),
  expectedVersion: pkg.version,
  scope:
    "Synthetic local Chromium; fresh contexts, 390x844 viewport, 4x CPU slowdown, 150ms latency, 1.6Mbps download/750Kbps upload. Not production field Core Web Vitals or a hardware benchmark.",
  targets: { lcpMs: 2500, cls: 0.1 },
  routes: [],
};
try {
  for (const route of ["/first-365-days", "/safenest"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.tinystepsPerf = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          window.tinystepsPerf.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) window.tinystepsPerf.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 1600000 / 8,
      uploadThroughput: 750000 / 8,
      connectionType: "cellular4g",
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto(new URL(route, base).href, { waitUntil: "load" });
    await page.waitForFunction(
      () => !document.querySelector(".page-content select[disabled]"),
    );
    await page.waitForTimeout(1500);
    const metrics = await page.evaluate(() => ({
      lcpMs: Math.round(window.tinystepsPerf.lcp),
      cls: Number(window.tinystepsPerf.cls.toFixed(4)),
      overflow: document.documentElement.scrollWidth > innerWidth,
      loadMs: Math.round(
        performance.getEntriesByType("navigation")[0].loadEventEnd,
      ),
      text: document.body.innerText,
    }));
    const versionMatches = metrics.text.includes(pkg.version);
    delete metrics.text;
    const passed =
      versionMatches &&
      metrics.lcpMs > 0 &&
      metrics.lcpMs <= report.targets.lcpMs &&
      metrics.cls <= report.targets.cls &&
      !metrics.overflow;
    report.routes.push({ route, ...metrics, versionMatches, passed });
    console.log(
      `${passed ? "PASS" : "FAIL"} ${route}: observed LCP ${metrics.lcpMs}ms, CLS ${metrics.cls}, load ${metrics.loadMs}ms, overflow=${metrics.overflow}`,
    );
    await context.close();
  }
  report.passed = report.routes.every((r) => r.passed);
  await mkdir(join(root, "verification-results/performance"), {
    recursive: true,
  });
  await writeFile(
    join(root, "verification-results/performance/report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  if (!report.passed) process.exitCode = 1;
} finally {
  await browser.close();
}
