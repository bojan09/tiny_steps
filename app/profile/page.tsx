import { ProfilePanel } from "@/components/profile-panel";
export const metadata = { title: "Your profile" };
export default function Profile() {
  return (
    <div className="page-content narrow">
      <header className="page-heading">
        <span className="eyebrow">YOUR OWN LITTLE CORNER</span>
        <h1>A little about you</h1>
        <p>You belong here, exactly as you are.</p>
      </header>
      <ProfilePanel />
    </div>
  );
}
