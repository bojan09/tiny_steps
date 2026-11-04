import { Localize } from "@/components/localize";
import { LearningStudio } from "@/components/learning-studio";
import { version } from "@/lib/version";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Plus, Leaf } from "lucide-react";
import { destinations, collections } from "@/lib/navigation";
import { StillLife } from "@/components/art";
import { Journey } from "@/components/journey";
import { Bookmarks } from "@/components/bookmarks";
import { FirstYear } from "@/components/first-year";
import { SafeNest } from "@/components/safenest";
const sectionIds: readonly string[] = destinations
  .filter((d) => !["home", "settings", "profile"].includes(d.id))
  .map((d) => d.id);
export function generateStaticParams() {
  return sectionIds.map((section) => ({ section }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{
    section: string;
  }>;
}) {
  const { section } = await params;
  return {
    title: destinations.find((d) => d.id === section)?.title || "Not found",
  };
}
const collectionNotes = [
  "A collection about getting comfortable with the everyday moments of holding and moving with your baby. Reviewed demonstrations will be added in the care-learning release.",
  "A home for learning about changing, cleaning, and choosing everyday care supplies. The full guided lessons are still being prepared.",
  "A place to explore the routines around bathing, clothing, and preparing a care space. Practical safety guidance will carry reviewed sources.",
  "A supportive space for different feeding journeys and questions to discuss with your healthcare team. Personalized feeding advice is outside this app’s role.",
  "A collection for understanding sleep-related education and building questions for your care team. Reviewed safe-sleep material will be clearly sourced.",
  "A place to learn about noticing, connecting, and communicating. No single approach works for every family.",
  "A home for reviewed reference information and conversations with qualified professionals. It will not replace clinical assessment.",
  "A collection about preparing for the world beyond your front door. Transport and safety lessons require current, jurisdiction-specific review.",
];
const topics: Record<string, [string, string][]> = {
  "first-365-days": [
    [
      "The beginning",
      "A place for your first-month questions, family routines, and learning interests.",
    ],
    [
      "Growing together",
      "Future monthly chapters will connect play, communication, and care topics without rigid comparisons.",
    ],
    [
      "Your own timeline",
      "Manual age-stage browsing will be available without requiring a baby’s birth date.",
    ],
  ],
  safenest: [
    [
      "Nursery & bedroom",
      "A home for carefully reviewed sleep-space and furniture guidance.",
    ],
    [
      "Kitchen & bathroom",
      "A space for exploring everyday routines and the questions to ask about your home.",
    ],
    [
      "Living room & entryway",
      "Room-by-room learning will include accessible hotspot lists alongside illustrations.",
    ],
  ],
  "everyday-guides": [
    [
      "Find a topic quickly",
      "The library will organize reviewed references around sleep, feeding, hygiene, outings, and support.",
    ],
    [
      "Keep useful things close",
      "Save collections now using Bookmarks. Individual reviewed guides will be added in the library release.",
    ],
    [
      "Know where guidance comes from",
      "Published health and safety guides must include source links, jurisdiction, version, and review date.",
    ],
  ],
  "parent-academy": [
    [
      "Share the everyday load",
      "Make space for conversations about what needs doing, who can help, and what can wait.",
    ],
    [
      "Bring your questions",
      "Keep a personal list of what you want to discuss with your care team. Your questions deserve time.",
    ],
    [
      "Make room for your family",
      "Every family is different. This space is being built for many caregiver structures and learning needs.",
    ],
  ],
  "learning-map": [
    [
      "Care and confidence",
      "Start in Care Academy, then explore the collections that fit your interests.",
    ],
    [
      "Home and everyday life",
      "SafeNest and Everyday Guides will connect practical topics across your home and routines.",
    ],
    [
      "You and your village",
      "Parent Academy makes caregiver wellbeing part of learning, alongside practical baby-care topics.",
    ],
  ],
};
export default async function Section({
  params,
}: {
  params: Promise<{
    section: string;
  }>;
}) {
  const { section } = await params;
  const d = destinations.find((v) => v.id === section);
  if (!d || !sectionIds.includes(section)) notFound();
  if (section === "first-365-days") return <FirstYear />;
  if (section === "safenest") return <SafeNest />;
  if (section === "care-academy") return <LearningStudio />;
  if (section === "learning-map") return <LearningStudio map />;
  if (section === "ai-assistant") return <LearningStudio companion />;
  const art = null;
  if (section === "my-journey")
    return (
      <div className="page-content">
        <header className="page-heading">
          <span className="eyebrow">
            <Localize>{"ONE SMALL STEP AT A TIME"}</Localize>
          </span>
          <h1>
            <Localize>{"My Journey"}</Localize>
          </h1>
          <p>
            <Localize>{"A little progress, without pressure."}</Localize>
          </p>
        </header>
        <Journey />
      </div>
    );
  if (section === "bookmarks")
    return (
      <div className="page-content narrow">
        <header className="page-heading">
          <span className="eyebrow">
            <Localize>{"KEEP THE GOOD THINGS CLOSE"}</Localize>
          </span>
          <h1>
            <Localize>{"Your saved places"}</Localize>
          </h1>
        </header>
        <Bookmarks />
      </div>
    );
  if (section === "help")
    return (
      <div className="page-content narrow">
        <header className="page-heading">
          <span className="eyebrow">
            <Localize>{"THOUGHTFULLY, FROM THE START"}</Localize>
          </span>
          <h1>
            <Localize>{"A little help, right here."}</Localize>
          </h1>
          <p>
            <Localize>{"TinySteps is taking its first steps, too."}</Localize>
          </p>
        </header>
        <section className="paper content-panel">
          <h2>
            <Localize>{"About this early release"}</Localize>
          </h2>
          <p>
            <Localize>{"Version "}</Localize>
            <Localize>{version}</Localize>
            <Localize>
              {
                " includes Google sign-in, account preferences, bookmarks, introduction progress, expanded appearance and your companion guidance, sourced first-year developmental cards and SafeNest comparisons, plus twelve guided Studio lessons with a Learning Map and saved learning progress. The wider 64-lesson curriculum and live AI responses are not released."
              }
            </Localize>
          </p>
          <h2>
            <Localize>{"Your information"}</Localize>
          </h2>
          <p>
            <Localize>
              {
                "Guest preferences, bookmarks, lesson and introduction progress stay in this browser. When signed in, these choices are stored in your account in Supabase. Guest choices are kept separate. This release does not send questions or family information to an AI provider."
              }
            </Localize>
          </p>
          <h2>
            <Localize>{"Learning with care"}</Localize>
          </h2>
          <p>
            <Localize>
              {
                "TinySteps is for education, not diagnosis, treatment, or emergency assessment. Illustrations set a welcoming tone; they are not safety instructions. Published educational cards and lessons link to their reviewed sources and identify the source jurisdiction."
              }
            </Localize>
          </p>
          <h2>
            <Localize>{"Make the app comfortable"}</Localize>
          </h2>
          <p>
            <Localize>{"Use "}</Localize>
            <Link href="/settings">
              <Localize>{"Appearance & settings"}</Localize>
            </Link>
            <Localize>
              {
                " to change the palette, text size, background, motion, and companion. You can navigate with a keyboard; a skip link appears when you press Tab at the start of a page."
              }
            </Localize>
          </p>
        </section>
      </div>
    );
  if (section === "downloads")
    return (
      <div className="page-content narrow">
        <header className="page-heading">
          <span className="eyebrow">
            <Localize>{"A LITTLE SUPPORT, EVEN OFFLINE"}</Localize>
          </span>
          <h1>
            <Localize>{"Take a little calm with you."}</Localize>
          </h1>
          <p>
            <Localize>
              {"Offline support starts with a simple, dependable fallback."}
            </Localize>
          </p>
        </header>
        <section className="paper content-panel">
          <h2>
            <Localize>{"Available in this release"}</Localize>
          </h2>
          <p>
            <Localize>
              {
                "After your first online visit to the production build, TinySteps saves a small offline page. If your connection drops, it explains what is available. Appearance settings and introduction progress remain in this browser."
              }
            </Localize>
          </p>
          <p>
            <Localize>
              {
                "Full lesson downloads and background account synchronization are planned for later phases. Sign-in and AI will require a connection."
              }
            </Localize>
          </p>
          <Link className="button primary" href="/offline">
            <Localize>{"Preview the offline page "}</Localize>
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    );
  return (
    <div className="page-content">
      <section className="section-hero">
        <div className="section-hero-copy">
          <span className="eyebrow">
            <Localize>{"YOUR LITTLE WORLD \u00B7"}</Localize>
            <Localize> </Localize>
            <Localize>
              {section === "care-academy"
                ? "LEARN"
                : section === "parent-academy"
                  ? "FEEL SUPPORTED"
                  : "EXPLORE"}
            </Localize>
          </span>
          <h1>
            <Localize>{d.title}</Localize>
          </h1>
          <p>
            <Localize>{d.description}</Localize>.
          </p>
          <p>
            <Localize>
              {section === "care-academy"
                ? "A thoughtful home for practical learning. Begin with a short introduction, then get to know the eight collections."
                : section === "ai-assistant"
                  ? "A future guide to reviewed TinySteps content. This foundation release does not provide AI answers or send your information to Groq."
                  : "A first look at the collection. Explore its focus below while the full, reviewed learning experiences are being prepared."}
            </Localize>
          </p>
          <Link
            href={
              section === "care-academy"
                ? "/care-academy/getting-started"
                : "/bookmarks"
            }
            className="button primary"
          >
            <Localize>
              {section === "care-academy"
                ? "Begin your introduction"
                : "Save your favorite collections"}
            </Localize>
            <Localize> </Localize>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="section-hero-art">
          <Localize>
            {art ? (
              <Image
                src={"/images/" + art + ".webp"}
                alt={
                  art === "house"
                    ? "Decorative illustration of a warm family home"
                    : art === "baby"
                      ? "An awake baby on a play mat, surrounded by botanical artwork"
                      : "The friendly TinySteps potato companion"
                }
                fill
                sizes="(max-width:767px) 100vw, 45vw"
                style={
                  art === "potato"
                    ? { objectFit: "contain", padding: 35 }
                    : undefined
                }
              />
            ) : (
              <StillLife kind={section === "care-academy" ? "care" : "guide"} />
            )}
          </Localize>
        </div>
      </section>
      {section === "care-academy" ? (
        <>
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <Localize>{"A HOME FOR EVERYDAY LEARNING"}</Localize>
              </span>
              <h2>
                <Localize>
                  {"Eight collections. One growing confidence."}
                </Localize>
              </h2>
            </div>
          </div>
          <div className="collection-grid">
            {collections.map((title, i) => (
              <details className="collection" key={title}>
                <summary>
                  <span>
                    0<Localize>{i + 1}</Localize>
                  </span>
                  <Localize>{title}</Localize>
                  <Plus size={17} />
                </summary>
                <p>
                  <Localize>{collectionNotes[i]}</Localize>
                </p>
              </details>
            ))}
          </div>
          <p className="release-note">
            <Localize>
              {
                "The app introduction is available now. The 64 reviewed care lessons are a separate upcoming delivery, not completed content in this release."
              }
            </Localize>
          </p>
        </>
      ) : section === "ai-assistant" ? (
        <section className="paper content-panel">
          <Leaf size={26} />
          <h2>
            <Localize>{"A helper with thoughtful boundaries."}</Localize>
          </h2>
          <p>
            <Localize>
              {
                "The assistant will help explain educational terms and point to reviewed lessons. It will cite the content it uses, acknowledge uncertainty, and stay within its educational role."
              }
            </Localize>
          </p>
          <p>
            <Localize>
              {"There is no active chat in Phase 1. You can explore"}
            </Localize>
            <Localize> </Localize>
            <Link href="/care-academy">
              <Localize>{"Care Academy"}</Localize>
            </Link>
            <Localize>{" or read"}</Localize>
            <Localize> </Localize>
            <Link href="/help">
              <Localize>{"how TinySteps approaches learning"}</Localize>
            </Link>
            .
          </p>
        </section>
      ) : (
        <>
          <div className="collection-grid">
            {(topics[section] || []).map(([title, body], i) => (
              <details className="collection" key={title}>
                <summary>
                  <span>
                    0<Localize>{i + 1}</Localize>
                  </span>
                  <Localize>{title}</Localize>
                  <Plus size={17} />
                </summary>
                <p>
                  <Localize>{body}</Localize>
                </p>
              </details>
            ))}
          </div>
          <div className="topic-links">
            {destinations
              .slice(1, 7)
              .filter((v) => v.id !== section)
              .map((v) => (
                <Link key={v.id} href={v.href}>
                  <Localize>{v.title}</Localize> ↗
                </Link>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
