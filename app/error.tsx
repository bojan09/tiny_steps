/* Full document navigation lets the service worker serve the offline fallback; Next RSC navigation cannot. */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { Localize } from "@/components/localize";
export default function PageError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="page-content narrow">
      <div className="paper content-panel" role="alert">
        <h1>
          <Localize>A little interruption.</Localize>
        </h1>
        <p>
          <Localize>
            This page could not open. Your saved account data has not been
            reset. Try again when your connection is available.
          </Localize>
        </p>
        <button className="button primary" onClick={reset}>
          <Localize>Try again</Localize>
        </button>
        <a className="text-link" href="/offline">
          <Localize>Open offline guide</Localize>
        </a>
      </div>
    </section>
  );
}
