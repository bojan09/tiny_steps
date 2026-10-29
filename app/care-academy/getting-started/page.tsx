import { Orientation } from "@/components/orientation";
export const metadata = { title: "A gentle place to begin" };
export default function Introduction() {
  return (
    <div className="page-content">
      <header className="page-heading">
        <span className="eyebrow">CARE ACADEMY · GETTING STARTED</span>
        <h1>A gentle place to begin.</h1>
        <p>Five small steps to make yourself at home.</p>
      </header>
      <Orientation />
    </div>
  );
}
