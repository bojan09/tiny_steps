import { Localize } from "@/components/localize";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page-content narrow">
      <header className="page-heading">
        <span className="eyebrow">
          <Localize>{"LET\u2019S FIND YOUR WAY"}</Localize>
        </span>
        <h1>
          <Localize>{"A small detour."}</Localize>
        </h1>
        <p>
          <Localize>
            {
              "We couldn\u2019t find that page. Your little village is right here."
            }
          </Localize>
        </p>
      </header>
      <Link className="button primary" href="/">
        <Localize>{"Back to home"}</Localize>
      </Link>
    </div>
  );
}
