/* Full document navigation lets the service worker serve the offline fallback; Next RSC navigation cannot. */
/* eslint-disable @next/next/no-html-link-for-pages */
import { Localize } from "@/components/localize";
import { learningLessons } from "@/lib/learning/content";
import { WifiOff } from "lucide-react";
export const metadata = { title: "Offline" };
export default function Offline() {
  return (
    <div className="page-content narrow">
      <section className="paper content-panel">
        <WifiOff size={32} aria-hidden="true" />
        <h1>
          <Localize>A moment to pause.</Localize>
        </h1>
        <p>
          <Localize>
            This read-only guide is prepared for offline use after your first
            connected visit. It contains the twelve released safety references,
            without account details or saved learning progress.
          </Localize>
        </p>
        <p>
          <Localize>
            Prepared 4 November 2026. Content reviewed 31 October 2026. A saved
            copy can become outdated. Reconnect to check current source
            guidance. Source websites need a connection.
          </Localize>
        </p>
        <p>
          <Localize>
            General education, not medical advice or a complete home safety
            assessment. Sign-in and account saves need a connection. Nothing on
            this page marks a lesson explored.
          </Localize>
        </p>
        <a href="/" className="button primary">
          <Localize>Try returning home</Localize>
        </a>
        <div className="offline-reference">
          {learningLessons.map((lesson) => (
            <details key={lesson.id}>
              <summary>
                <Localize>{lesson.title}</Localize>
              </summary>
              <div>
                <p>
                  <strong>
                    <Localize>Avoid</Localize>:{" "}
                  </strong>
                  <Localize>{lesson.avoid}</Localize>
                </p>
                <p>
                  <strong>
                    <Localize>Reduce risk</Localize>:{" "}
                  </strong>
                  <Localize>{lesson.safer}</Localize>
                </p>
                <p>
                  <Localize>{lesson.action}</Localize>
                </p>
                <a href={lesson.source.url} target="_blank" rel="noreferrer">
                  <Localize>{lesson.source.title}</Localize>
                </a>
                <p className="field-help">
                  <Localize>{lesson.source.jurisdiction}</Localize> ·{" "}
                  <Localize>{lesson.source.sourceDate}</Localize>
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
