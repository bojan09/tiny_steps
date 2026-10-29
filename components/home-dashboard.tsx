"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Leaf,
  Heart,
  Check,
  Clock3,
} from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { Icon } from "./icons";
import { StillLife, Botanical } from "./art";
const cards = [
  {
    title: "Care Academy",
    sub: "Little skills. Growing confidence.",
    href: "/care-academy",
    art: "care",
    icon: "book",
    color: "peach",
  },
  {
    title: "First 365 Days",
    sub: "A little wonder in every stage.",
    href: "/first-365-days",
    art: "baby",
    icon: "calendar",
    color: "sage",
  },
  {
    title: "SafeNest",
    sub: "Make room for peace of mind.",
    href: "/safenest",
    art: "house",
    icon: "house",
    color: "sand",
  },
  {
    title: "Everyday Guides",
    sub: "A helping hand, right here.",
    href: "/everyday-guides",
    art: "guide",
    icon: "guide",
    color: "peach",
  },
  {
    title: "Parent Academy",
    sub: "Because you need care, too.",
    href: "/parent-academy",
    art: "parent",
    icon: "heart",
    color: "sage",
  },
  {
    title: "AI Assistant",
    sub: "Meet your future learning helper.",
    href: "/ai-assistant",
    art: "potato",
    icon: "sparkles",
    color: "lavender",
  },
];
export function HomeDashboard() {
  const p = usePreferences((s) => s.preferences);
  const step = usePreferences((s) => s.orientationStep);
  const done = usePreferences((s) => s.orientationComplete);
  const reduced = useReducedMotion();
  const animate = !reduced && p.motion !== "off" && p.motion !== "minimal";
  return (
    <div className="dashboard">
      <section className="hero">
        <Image
          src="/images/living-room.webp"
          alt="A parent sharing a quiet moment with their newborn in a sunlit room"
          fill
          priority
          sizes="(max-width: 767px) 100vw, 85vw"
          className="hero-photo"
        />
        <div className="hero-wash" />
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-line" /> A GENTLER BEGINNING TO PARENTHOOD
          </span>
          <p className="welcome">Welcome to your little village</p>
          <h1>
            Small steps,
            <br />a brighter tomorrow.
          </h1>
          <p className="hero-description">
            A little knowledge. A little reassurance.
            <br />A whole lot of growing together.
          </p>
          <Link className="button primary" href="/care-academy/getting-started">
            Find your first step <ArrowRight size={17} />
          </Link>
          <span className="hero-footnote">
            <Heart size={14} /> Made for every kind of family
          </span>
        </div>
        {p.companion && (
          <motion.div
            className="hero-companion"
            animate={animate ? { y: [0, -6, 0] } : undefined}
            transition={{ duration: 5, repeat: 2, ease: "easeInOut" }}
          >
            <div className="speech-bubble">
              You don’t have to know it all.
              <br />
              We’ll take it one step at a time.
            </div>
            <Image
              src="/images/potato.webp"
              alt="Sprout, your friendly TinySteps companion"
              width={130}
              height={150}
            />
          </motion.div>
        )}
        <div className="hero-caption">
          <span /> A MOMENT TO CONNECT
        </div>
      </section>
      <section className="dashboard-overlap" aria-label="Your next steps">
        <Link
          className="continue-card paper"
          href="/care-academy/getting-started"
        >
          <div className="mini-art">
            <StillLife />
          </div>
          <div>
            <p className="eyebrow">
              {done
                ? "A LOVELY FIRST STEP"
                : step
                  ? "CONTINUE YOUR INTRODUCTION"
                  : "START SOMETHING SMALL"}
            </p>
            <h2>
              {done ? "You’re finding your feet" : "A gentle place to begin"}
            </h2>
            <p>Meet your TinySteps learning space</p>
            <div className="small-progress">
              <span>
                <i style={{ width: done ? "100%" : step * 25 + "%" }} />
              </span>
              <small>{done ? "Complete" : "5 small steps · 3 min"}</small>
            </div>
          </div>
          <span className="play-button">
            <Play size={16} fill="currentColor" />
          </span>
        </Link>
        <Link className="journey-card paper" href="/my-journey">
          <span className="round-icon peach">
            <Icon name="journey" size={24} />
          </span>
          <div>
            <p className="eyebrow">YOUR JOURNEY</p>
            <h2>Your pace is the right pace.</h2>
            <p>
              {done
                ? "1 introduction completed"
                : "Every beginning counts. Yours starts here."}
            </p>
          </div>
          <ArrowUpRight size={21} />
        </Link>
      </section>
      <section className="explore-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE SUPPORT, ALL AROUND</p>
            <h2>Grow into parenthood, your way.</h2>
          </div>
          <Link className="text-link" href="/learning-map">
            See your learning map <ArrowRight size={16} />
          </Link>
        </div>
        <div className="destination-grid">
          {cards.map((c, i) => (
            <motion.div
              key={c.href}
              initial={false}
              whileHover={animate ? { y: -4 } : undefined}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={c.href}
                className={"destination-card tone-" + c.color}
              >
                <div className="destination-art">
                  {["baby", "house", "potato"].includes(c.art) ? (
                    <Image
                      src={"/images/" + c.art + ".webp"}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 45vw, 16vw"
                      className={c.art === "potato" ? "contain" : ""}
                    />
                  ) : c.art === "parent" ? (
                    <Image
                      src="/images/living-room.webp"
                      alt=""
                      fill
                      sizes="(max-width: 767px) 45vw, 16vw"
                      className="parent-crop"
                    />
                  ) : (
                    <StillLife kind={c.art} />
                  )}
                  <span className="card-number">0{i + 1}</span>
                </div>
                <div className="destination-copy">
                  <span className="destination-title">
                    <h3>{c.title}</h3>
                    <ArrowUpRight size={16} />
                  </span>
                  <p>{c.sub}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="gentle-row">
        <div className="gentle-note">
          <Botanical className="note-botanical" />
          <span className="eyebrow">A LITTLE REMINDER</span>
          <h2>
            You’re learning.
            <br />
            They’re growing.
            <br />
            <em>You’re doing this together.</em>
          </h2>
          <p>There’s room for questions, pauses, and starting again.</p>
          <span className="small-signature">
            <Leaf size={16} /> With you, one step at a time
          </span>
        </div>
        <div className="today-card paper">
          <span className="eyebrow">MAKE YOURSELF AT HOME</span>
          <h2>A space that feels like you.</h2>
          <p>
            A softer palette, a quieter background, a little less motion. Make
            room for what feels good today.
          </p>
          <div className="palette-dots" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <Link className="text-link" href="/settings">
            Find your calm <ArrowRight size={16} />
          </Link>
        </div>
        <div className="values-card">
          <div>
            <Check size={18} />
            <span>Learn at your own pace</span>
          </div>
          <div>
            <Heart size={18} />
            <span>All families belong here</span>
          </div>
          <div>
            <Clock3 size={18} />
            <span>Small moments count</span>
          </div>
          <p>
            Thoughtfully built for the beautifully
            <br />
            imperfect days of parenthood.
          </p>
          <Link href="/help">
            Our approach <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
