"use client";
import { Localize, useTranslate } from "@/components/localize";
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
import { useAccount } from "./account-provider";
import { HomeFocus } from "./home-focus";
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
    title: "Learning Companion",
    sub: "Find your next reviewed lesson.",
    href: "/ai-assistant",
    art: "potato",
    icon: "sparkles",
    color: "lavender",
  },
];
export function HomeDashboard() {
  const localeText = useTranslate();
  const { account } = useAccount();
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
          alt={localeText(
            "A parent sharing a quiet moment with their newborn in a sunlit room",
          )}
          fill
          priority
          sizes="(max-width: 767px) 100vw, 85vw"
          className="hero-photo"
        />
        <div className="hero-wash" />
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-line" />
            <Localize>{" A GENTLER BEGINNING TO PARENTHOOD"}</Localize>
          </span>
          <p className="welcome">
            {account?.displayName
              ? `${localeText("Welcome back,")} ${account.displayName}`
              : localeText("Welcome to your little village")}
          </p>
          <h1>
            <Localize>{"Small steps,"}</Localize>
            <br />
            <Localize>{"a brighter tomorrow."}</Localize>
          </h1>
          <p className="hero-description">
            <Localize>{"A little knowledge. A little reassurance."}</Localize>
            <br />
            <Localize>{"A whole lot of growing together."}</Localize>
          </p>
          <Link
            className="button primary"
            href={done ? "/care-academy" : "/care-academy/getting-started"}
          >
            <Localize>
              {done
                ? "Explore your collections"
                : step
                  ? "Continue your introduction"
                  : "Find your first step"}
            </Localize>
            <Localize> </Localize>
            <ArrowRight size={17} />
          </Link>
          <span className="hero-footnote">
            <Heart size={14} />
            <Localize>{" Made for every kind of family"}</Localize>
          </span>
        </div>
        {p.companion && (
          <motion.div
            className="hero-companion"
            animate={animate ? { y: [0, -6, 0] } : undefined}
            transition={{ duration: 5, repeat: 2, ease: "easeInOut" }}
          >
            <div className="speech-bubble">
              <Localize>{"You don\u2019t have to know it all."}</Localize>
              <br />
              <Localize>{"We\u2019ll take it one step at a time."}</Localize>
            </div>
            <Image
              src="/images/potato.webp"
              alt={localeText("Sprout, your friendly TinySteps companion")}
              width={130}
              height={150}
            />
          </motion.div>
        )}
        <div className="hero-caption">
          <span />
          <Localize>{" A MOMENT TO CONNECT"}</Localize>
        </div>
      </section>
      <section
        className="dashboard-overlap"
        aria-label={localeText("Your next steps")}
      >
        <Link
          className="continue-card paper"
          href="/care-academy/getting-started"
        >
          <div className="mini-art">
            <StillLife />
          </div>
          <div>
            <p className="eyebrow">
              <Localize>
                {done
                  ? "A LOVELY FIRST STEP"
                  : step
                    ? "CONTINUE YOUR INTRODUCTION"
                    : "START SOMETHING SMALL"}
              </Localize>
            </p>
            <h2>
              <Localize>
                {done ? "You’re finding your feet" : "A gentle place to begin"}
              </Localize>
            </h2>
            <p>
              <Localize>{"Meet your TinySteps learning space"}</Localize>
            </p>
            <div className="small-progress">
              <span>
                <i style={{ width: done ? "100%" : step * 25 + "%" }} />
              </span>
              <small>
                <Localize>
                  {done ? "Complete" : "5 small steps · 3 min"}
                </Localize>
              </small>
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
            <p className="eyebrow">
              <Localize>{"YOUR JOURNEY"}</Localize>
            </p>
            <h2>
              <Localize>{"Your pace is the right pace."}</Localize>
            </h2>
            <p>
              <Localize>
                {done
                  ? "1 introduction completed"
                  : "Every beginning counts. Yours starts here."}
              </Localize>
            </p>
          </div>
          <ArrowUpRight size={21} />
        </Link>
      </section>
      <HomeFocus />
      <section className="explore-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <Localize>{"A LITTLE SUPPORT, ALL AROUND"}</Localize>
            </p>
            <h2>
              <Localize>{"Grow into parenthood, your way."}</Localize>
            </h2>
          </div>
          <Link className="text-link" href="/learning-map">
            <Localize>{"See your learning map "}</Localize>
            <ArrowRight size={16} />
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
                  <Localize>
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
                  </Localize>
                  <span className="card-number">
                    0<Localize>{i + 1}</Localize>
                  </span>
                </div>
                <div className="destination-copy">
                  <span className="destination-title">
                    <h3>
                      <Localize>{c.title}</Localize>
                    </h3>
                    <ArrowUpRight size={16} />
                  </span>
                  <p>
                    <Localize>{c.sub}</Localize>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="gentle-row">
        <div className="gentle-note">
          <Botanical className="note-botanical" />
          <span className="eyebrow">
            <Localize>{"A LITTLE REMINDER"}</Localize>
          </span>
          <h2>
            <Localize>{"You\u2019re learning."}</Localize>
            <br />
            <Localize>{"They\u2019re growing."}</Localize>
            <br />
            <em>
              <Localize>{"You\u2019re doing this together."}</Localize>
            </em>
          </h2>
          <p>
            <Localize>
              {"There\u2019s room for questions, pauses, and starting again."}
            </Localize>
          </p>
          <span className="small-signature">
            <Leaf size={16} />
            <Localize>{" With you, one step at a time"}</Localize>
          </span>
        </div>
        <div className="today-card paper">
          <span className="eyebrow">
            <Localize>{"MAKE YOURSELF AT HOME"}</Localize>
          </span>
          <h2>
            <Localize>{"A space that feels like you."}</Localize>
          </h2>
          <p>
            <Localize>
              {
                "A softer palette, a quieter background, a little less motion. Make room for what feels good today."
              }
            </Localize>
          </p>
          <div className="palette-dots" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <Link className="text-link" href="/settings">
            <Localize>{"Find your calm "}</Localize>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="values-card">
          <div>
            <Check size={18} />
            <span>
              <Localize>{"Learn at your own pace"}</Localize>
            </span>
          </div>
          <div>
            <Heart size={18} />
            <span>
              <Localize>{"All families belong here"}</Localize>
            </span>
          </div>
          <div>
            <Clock3 size={18} />
            <span>
              <Localize>{"Small moments count"}</Localize>
            </span>
          </div>
          <p>
            <Localize>{"Thoughtfully built for the beautifully"}</Localize>
            <br />
            <Localize>{"imperfect days of parenthood."}</Localize>
          </p>
          <Link href="/help">
            <Localize>{"Our approach "}</Localize>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
