"use client";
import Link from "next/link";
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
  const pathname = usePathname();
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
        (d.title + " " + d.description)
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
      title={d.title}
    >
      <Icon name={d.icon} />
      <span>{d.title}</span>
    </Link>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside
        ref={sidebarRef}
        inert={isMobile && !menu}
        role={isMobile && menu ? "dialog" : undefined}
        aria-modal={isMobile && menu ? true : undefined}
        aria-label={isMobile && menu ? "Site navigation" : undefined}
        className={"sidebar " + (menu ? "is-open" : "")}
      >
        <Link
          href="/"
          className="brand"
          aria-label="TinySteps home"
          onClick={close}
        >
          <BrandMark />
          <span>
            TinySteps<small>A gentler beginning</small>
          </span>
        </Link>
        <button
          className="icon-button close-menu"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        >
          <X />
        </button>
        <nav aria-label="Main navigation">
          <p className="nav-label">YOUR LITTLE WORLD</p>
          {destinations.slice(0, 8).map(navLink)}
          <p className="nav-label tools-label">HERE TO HELP</p>
          {destinations.slice(8, 11).map(navLink)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Leaf size={18} />
            <p>
              There’s no perfect parent.
              <br />
              Just your next small step.
            </p>
          </div>
          {navLink(destinations[11])}
        </div>
      </aside>
      {menu && (
        <button
          className="menu-backdrop"
          aria-label="Close navigation overlay"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="workspace" inert={isMobile && menu}>
        <header className="topbar">
          <button
            ref={menuButtonRef}
            className="icon-button mobile-menu"
            onClick={() => setMenu(true)}
            aria-label="Open navigation"
            aria-expanded={menu}
          >
            <Menu />
          </button>
          <div className="search-wrap" ref={searchRef}>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search TinySteps"
              placeholder="Search lessons, topics, or a little reassurance…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQuery("");
              }}
            />
            {query && (
              <div className="search-results" aria-label="Search results">
                <p className="eyebrow">EXPLORE TINYSTEPS</p>
                {results.length ? (
                  results.map((d) => (
                    <Link href={d.href} key={d.id} onClick={close}>
                      <Icon name={d.icon} />
                      <span>
                        {d.title}
                        <small>{d.description}</small>
                      </span>
                      <ArrowUpRight size={16} />
                    </Link>
                  ))
                ) : (
                  <p>No destinations found. Try “care” or “settings”.</p>
                )}
              </div>
            )}
          </div>
          <span className="topbar-message">
            <span className="status-dot" />A little more confidence, every day
          </span>
          <div className="account-wrap">
            <button
              className="account-button"
              onClick={() => setAccount(!account)}
              aria-expanded={account}
              aria-label="Open account menu"
            >
              <span className="avatar">
                <Icon name="user" />
              </span>
              <span className="account-text">
                {auth.account?.displayName || "Your space"}
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
                      {d.title}
                    </Link>
                  ),
                )}
                <p>
                  {auth.account
                    ? "Signed in · Your account"
                    : "Browsing on this device"}
                </p>
              </div>
            )}
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="footer">
          <span>
            <BrandMark />
            Little steps. Lasting confidence. · v{version}
          </span>
          <Link href="/help">Made with care · About TinySteps</Link>
        </footer>
      </div>
      <nav
        inert={isMobile && menu}
        className="bottom-nav"
        aria-label="Mobile navigation"
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
              {d.id === "care-academy"
                ? "Learn"
                : d.id === "first-365-days"
                  ? "Explore"
                  : d.id === "my-journey"
                    ? "Journey"
                    : d.title}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
