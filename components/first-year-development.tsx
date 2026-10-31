import { Leaf, MessageCircle, Sparkles } from "lucide-react";
import {
  developmentCopy,
  developmentForMonth,
  type DevelopmentLanguage,
} from "@/lib/first-year/development";

export function FirstYearDevelopment({
  language,
  month,
}: {
  language: DevelopmentLanguage;
  month: number;
}) {
  const stage = developmentForMonth(month);
  const content = stage[language];
  const t = developmentCopy[language];
  return (
    <section
      className="year-development"
      aria-labelledby="year-development-title"
    >
      <p className="eyebrow">{t.eyebrow}</p>
      <h3 id="year-development-title">{content.title}</h3>
      <p className="year-reference">
        {t.reference}: {stage.referenceAge} {t.months}
      </p>
      <p>{t.context}</p>
      {month < stage.referenceAge && (
        <p className="year-ahead">
          <strong>{t.ahead}</strong>
        </p>
      )}
      <div className="year-learning-cards">
        <section aria-labelledby="year-observe-title">
          <Leaf size={22} aria-hidden="true" />
          <h4 id="year-observe-title">{t.examples}</h4>
          <ul>
            {content.examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="year-activity-title">
          <Sparkles size={22} aria-hidden="true" />
          <h4 id="year-activity-title">{t.activity}</h4>
          <p>{content.activity}</p>
          <small>{t.reading}</small>
        </section>
      </div>
      <aside className="year-concerns" aria-labelledby="year-concerns-title">
        <MessageCircle size={22} aria-hidden="true" />
        <h4 id="year-concerns-title">{t.concerns}</h4>
        <p>{t.concernText}</p>
      </aside>
      <p>
        <a className="year-source-link" href={stage.source}>
          {t.source}
        </a>
      </p>
      <small>{t.reviewed}</small>
    </section>
  );
}
