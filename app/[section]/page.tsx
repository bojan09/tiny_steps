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
  params: Promise<{ section: string }>;
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
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const d = destinations.find((v) => v.id === section);
  if (!d || !sectionIds.includes(section)) notFound();
  if (section === "first-365-days") return <FirstYear />;
  if (section === "safenest") return <SafeNest />;
  const art =
    section === "first-365-days"
      ? "baby"
      : section === "safenest"
        ? "house"
        : section === "ai-assistant"
          ? "potato"
          : null;
  if (section === "my-journey")
    return (
      <div className="page-content">
        <header className="page-heading">
          <span className="eyebrow">ONE SMALL STEP AT A TIME</span>
          <h1>My Journey</h1>
          <p>A little progress, without pressure.</p>
        </header>
        <Journey />
      </div>
    );
  if (section === "bookmarks")
    return (
      <div className="page-content narrow">
        <header className="page-heading">
          <span className="eyebrow">KEEP THE GOOD THINGS CLOSE</span>
          <h1>Your saved places</h1>
        </header>
        <Bookmarks />
      </div>
    );
  if (section === "help")
    return (
      <div className="page-content narrow">
        <header className="page-heading">
          <span className="eyebrow">THOUGHTFULLY, FROM THE START</span>
          <h1>A little help, right here.</h1>
          <p>TinySteps is taking its first steps, too.</p>
        </header>
        <section className="paper content-panel">
          <h2>About this early release</h2>
          <p>
            Version {version} includes Google sign-in, account preferences,
            bookmarks, introduction progress, expanded appearance and your
            potato companion, first-year caregiver reflections and the SafeNest
            reference-review planner. Reviewed developmental cards, safe/unsafe
            room lessons, full care lessons and AI responses are still being
            prepared.
          </p>
          <h2>Your information</h2>
          <p>
            Guest preferences, bookmarks and introduction progress stay in this
            browser. When signed in, these choices are stored in your account in
            Supabase. Guest choices are kept separate. This release does not
            send questions or family information to an AI provider.
          </p>
          <h2>Learning with care</h2>
          <p>
            TinySteps is for education, not diagnosis, treatment, or emergency
            assessment. Illustrations set a welcoming tone; they are not safety
            instructions. Any future health or safety guidance must be verified
            against current authoritative sources before it is published.
          </p>
          <h2>Make the app comfortable</h2>
          <p>
            Use <Link href="/settings">Appearance & settings</Link> to change
            the palette, text size, background, motion, and companion. You can
            navigate with a keyboard; a skip link appears when you press Tab at
            the start of a page.
          </p>
        </section>
      </div>
    );
  if (section === "downloads")
    return (
      <div className="page-content narrow">
        <header className="page-heading">
          <span className="eyebrow">A LITTLE SUPPORT, EVEN OFFLINE</span>
          <h1>Take a little calm with you.</h1>
          <p>Offline support starts with a simple, dependable fallback.</p>
        </header>
        <section className="paper content-panel">
          <h2>Available in this release</h2>
          <p>
            After your first online visit to the production build, TinySteps
            saves a small offline page. If your connection drops, it explains
            what is available. Appearance settings and introduction progress
            remain in this browser.
          </p>
          <p>
            Full lesson downloads and background account synchronization are
            planned for later phases. Sign-in and AI will require a connection.
          </p>
          <Link className="button primary" href="/offline">
            Preview the offline page <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    );
  return (
    <div className="page-content">
      <section className="section-hero">
        <div className="section-hero-copy">
          <span className="eyebrow">
            YOUR LITTLE WORLD ·{" "}
            {section === "care-academy"
              ? "LEARN"
              : section === "parent-academy"
                ? "FEEL SUPPORTED"
                : "EXPLORE"}
          </span>
          <h1>{d.title}</h1>
          <p>{d.description}.</p>
          <p>
            {section === "care-academy"
              ? "A thoughtful home for practical learning. Begin with a short introduction, then get to know the eight collections."
              : section === "ai-assistant"
                ? "A future guide to reviewed TinySteps content. This foundation release does not provide AI answers or send your information to Groq."
                : "A first look at the collection. Explore its focus below while the full, reviewed learning experiences are being prepared."}
          </p>
          <Link
            href={
              section === "care-academy"
                ? "/care-academy/getting-started"
                : "/bookmarks"
            }
            className="button primary"
          >
            {section === "care-academy"
              ? "Begin your introduction"
              : "Save your favorite collections"}{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="section-hero-art">
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
        </div>
      </section>
      {section === "care-academy" ? (
        <>
          <div className="section-heading">
            <div>
              <span className="eyebrow">A HOME FOR EVERYDAY LEARNING</span>
              <h2>Eight collections. One growing confidence.</h2>
            </div>
          </div>
          <div className="collection-grid">
            {collections.map((title, i) => (
              <details className="collection" key={title}>
                <summary>
                  <span>0{i + 1}</span>
                  {title}
                  <Plus size={17} />
                </summary>
                <p>{collectionNotes[i]}</p>
              </details>
            ))}
          </div>
          <p className="release-note">
            The app introduction is available now. The 64 reviewed care lessons
            are a separate upcoming delivery, not completed content in this
            release.
          </p>
        </>
      ) : section === "ai-assistant" ? (
        <section className="paper content-panel">
          <Leaf size={26} />
          <h2>A helper with thoughtful boundaries.</h2>
          <p>
            The assistant will help explain educational terms and point to
            reviewed lessons. It will cite the content it uses, acknowledge
            uncertainty, and stay within its educational role.
          </p>
          <p>
            There is no active chat in Phase 1. You can explore{" "}
            <Link href="/care-academy">Care Academy</Link> or read{" "}
            <Link href="/help">how TinySteps approaches learning</Link>.
          </p>
        </section>
      ) : (
        <>
          <div className="collection-grid">
            {(topics[section] || []).map(([title, body], i) => (
              <details className="collection" key={title}>
                <summary>
                  <span>0{i + 1}</span>
                  {title}
                  <Plus size={17} />
                </summary>
                <p>{body}</p>
              </details>
            ))}
          </div>
          <div className="topic-links">
            {destinations
              .slice(1, 7)
              .filter((v) => v.id !== section)
              .map((v) => (
                <Link key={v.id} href={v.href}>
                  {v.title} ↗
                </Link>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
