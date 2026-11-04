import { Localize } from "@/components/localize";
import { Orientation } from "@/components/orientation";
export const metadata = { title: "A gentle place to begin" };
export default function Introduction() {
  return (
    <div className="page-content">
      <header className="page-heading">
        <span className="eyebrow">
          <Localize>{"CARE ACADEMY \u00B7 GETTING STARTED"}</Localize>
        </span>
        <h1>
          <Localize>{"A gentle place to begin."}</Localize>
        </h1>
        <p>
          <Localize>{"Five small steps to make yourself at home."}</Localize>
        </p>
      </header>
      <Orientation />
    </div>
  );
}
