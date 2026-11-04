"use client";
import { Localize, useTranslate } from "@/components/localize";
import Link from "next/link";
import { PwaStatus } from "./pwa-status";
import { usePreferences } from "@/lib/preferences";
import { useAccount } from "./account-provider";
import { version } from "@/lib/version";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { Search, ArrowUpRight, ChevronDown, X, Menu, Leaf } from "lucide-react";
import { destinations } from "@/lib/navigation";
import { Icon, BrandMark } from "./icons";
function subscribeMobile(callback: () => void) {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}
export function AppShell({ children }: { children: React.ReactNode }) {
  const localeText = useTranslate();
  const pathname = usePathname();
  const language = usePreferences((s) => s.preferences.language);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("main h1");
      if (heading?.textContent)
        document.title =
          heading.innerText.replace(/\s+/g, " ") + " · TinySteps";
    });
    return () => cancelAnimationFrame(frame);
  }, [language, pathname]);
  const auth = useAccount();
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    isMobileViewport,
    () => false,
  );
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const [account, setAccount] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const results = query.trim()
    ? destinations.filter((d) =>
        (
          d.title +
          " " +
          d.description +
          " " +
          localeText(d.title) +
          " " +
          localeText(d.description)
        )
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      )
    : [];
  useEffect(() => {
    const dismiss = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setQuery("");
    };
    document.addEventListener("click", dismiss);
    return () => document.removeEventListener("click", dismiss);
  }, []);
  useEffect(() => {
    if (!menu || !isMobile) return;
    const previous = document.activeElement as HTMLElement | null;
    const sidebar = sidebarRef.current;
    sidebar?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        return;
      }
      if (event.key === "Tab" && sidebar) {
        const items = Array.from(
          sidebar.querySelectorAll<HTMLElement>("a[href],button"),
        ).filter((el) => el.getClientRects().length > 0);
        const first = items[0],
          last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = priorOverflow;
      previous?.focus();
    };
  }, [menu, isMobile]);
  const close = () => {
    setMenu(false);
    setQuery("");
    setAccount(false);
  };
  const navLink = (d: (typeof destinations)[number]) => (
    <Link
      key={d.id}
      href={d.href}
      onClick={close}
      className={
        "nav-link " +
        (pathname === d.href ||
        (d.href !== "/" && pathname.startsWith(d.href + "/"))
          ? "active"
          : "")
      }
      aria-current={pathname === d.href ? "page" : undefined}
      title={localeText(d.title)}
    >
      <Icon name={d.icon} />
      <span>
        <Localize>{d.title}</Localize>
      </span>
    </Link>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        <Localize>{"Skip to content"}</Localize>
      </a>
      <aside
        ref={sidebarRef}
        inert={isMobile && !menu}
        role={isMobile && menu ? "dialog" : undefined}
        aria-modal={isMobile && menu ? true : undefined}
        aria-label={localeText(
          isMobile && menu ? "Site navigation" : undefined,
        )}
        className={"sidebar " + (menu ? "is-open" : "")}
      >
        <Link
          href="/"
          className="brand"
          aria-label={localeText("TinySteps home")}
          onClick={close}
        >
          <BrandMark />
          <span>
            <Localize>{"TinySteps"}</Localize>
            <small>
              <Localize>{"A gentler beginning"}</Localize>
            </small>
          </span>
        </Link>
        <button
          className="icon-button close-menu"
          aria-label={localeText("Close navigation")}
          onClick={() => setMenu(false)}
        >
          <X />
        </button>
        <nav aria-label={localeText("Main navigation")}>
          <p className="nav-label">
            <Localize>{"YOUR LITTLE WORLD"}</Localize>
          </p>
          {destinations.slice(0, 8).map(navLink)}
          <p className="nav-label tools-label">
            <Localize>{"HERE TO HELP"}</Localize>
          </p>
          {destinations.slice(8, 11).map(navLink)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Leaf size={18} />
            <p>
              <Localize>{"There\u2019s no perfect parent."}</Localize>
              <br />
              <Localize>{"Just your next small step."}</Localize>
            </p>
          </div>
          <Localize>{navLink(destinations[11])}</Localize>
        </div>
      </aside>
      {menu && (
        <button
          className="menu-backdrop"
          aria-label={localeText("Close navigation overlay")}
          onClick={() => setMenu(false)}
        />
      )}
      <div className="workspace" inert={isMobile && menu}>
        <header className="topbar">
          <button
            ref={menuButtonRef}
            className="icon-button mobile-menu"
            onClick={() => setMenu(true)}
            aria-label={localeText("Open navigation")}
            aria-expanded={menu}
          >
            <Menu />
          </button>
          <div
            className="search-wrap"
            ref={searchRef}
            data-mobile-placeholder={localeText("Find a little support…")}
          >
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              aria-label={localeText("Search TinySteps")}
              placeholder={localeText(
                "Search lessons, topics, or a little reassurance\u2026",
              )}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQuery("");
              }}
            />
            {query && (
              <div
                className="search-results"
                aria-label={localeText("Search results")}
              >
                <p className="eyebrow">
                  <Localize>{"EXPLORE TINYSTEPS"}</Localize>
                </p>
                {results.length ? (
                  results.map((d) => (
                    <Link href={d.href} key={d.id} onClick={close}>
                      <Icon name={d.icon} />
                      <span>
                        <Localize>{d.title}</Localize>
                        <small>
                          <Localize>{d.description}</Localize>
                        </small>
                      </span>
                      <ArrowUpRight size={16} />
                    </Link>
                  ))
                ) : (
                  <p>
                    <Localize>
                      {
                        "No destinations found. Try \u201Ccare\u201D or \u201Csettings\u201D."
                      }
                    </Localize>
                  </p>
                )}
              </div>
            )}
          </div>
          <span className="topbar-message">
            <span className="status-dot" />
            <Localize>{"A little more confidence, every day"}</Localize>
          </span>
          <div className="account-wrap">
            <button
              className="account-button"
              onClick={() => setAccount(!account)}
              aria-expanded={account}
              aria-label={localeText("Open account menu")}
            >
              <span className="avatar">
                <Icon name="user" />
              </span>
              <span className="account-text">
                {auth.account?.displayName || <Localize>Your space</Localize>}
              </span>
              <ChevronDown size={14} />
            </button>
            {account && (
              <div
                className="account-menu"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setAccount(false);
                }}
              >
                {[destinations[12], destinations[11], destinations[13]].map(
                  (d) => (
                    <Link key={d.id} href={d.href} onClick={close}>
                      <Icon name={d.icon} />
                      <Localize>{d.title}</Localize>
                    </Link>
                  ),
                )}
                <p>
                  <Localize>
                    {auth.account
                      ? "Signed in · Your account"
                      : "Browsing on this device"}
                  </Localize>
                </p>
              </div>
            )}
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <PwaStatus />
          {children}
        </main>
        <footer className="footer">
          <span>
            <BrandMark />
            <Localize>{"Little steps. Lasting confidence. \u00B7 v"}</Localize>
            <Localize>{version}</Localize>
          </span>
          <Link href="/help">
            <Localize>{"Made with care \u00B7 About TinySteps"}</Localize>
          </Link>
        </footer>
      </div>
      <nav
        inert={isMobile && menu}
        className="bottom-nav"
        aria-label={localeText("Mobile navigation")}
      >
        {[
          destinations[0],
          destinations[1],
          destinations[2],
          destinations[3],
          destinations[7],
        ].map((d) => (
          <Link
            key={d.id}
            href={d.href}
            onClick={close}
            className={pathname === d.href ? "active" : ""}
            aria-current={pathname === d.href ? "page" : undefined}
          >
            <Icon name={d.icon} />
            <span>
              <Localize>
                {d.id === "care-academy"
                  ? "Learn"
                  : d.id === "first-365-days"
                    ? "Explore"
                    : d.id === "my-journey"
                      ? "Journey"
                      : d.title}
              </Localize>
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
