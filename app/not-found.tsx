import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page-content narrow">
      <header className="page-heading">
        <span className="eyebrow">LET’S FIND YOUR WAY</span>
        <h1>A small detour.</h1>
        <p>We couldn’t find that page. Your little village is right here.</p>
      </header>
      <Link className="button primary" href="/">
        Back to home
      </Link>
    </div>
  );
}
