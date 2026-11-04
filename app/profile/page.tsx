import { Localize } from "@/components/localize";
import { ProfilePanel } from "@/components/profile-panel";
export const metadata = { title: "Your profile" };
export default function Profile() {
  return (
    <div className="page-content narrow">
      <header className="page-heading">
        <span className="eyebrow">
          <Localize>{"YOUR OWN LITTLE CORNER"}</Localize>
        </span>
        <h1>
          <Localize>{"A little about you"}</Localize>
        </h1>
        <p>
          <Localize>{"You belong here, exactly as you are."}</Localize>
        </p>
      </header>
      <ProfilePanel />
    </div>
  );
}
