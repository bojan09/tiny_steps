import { PreferencesPanel } from "@/components/preferences-panel";
export const metadata = { title: "Appearance & settings" };
export default function Settings() {
  return (
    <div className="page-content">
      <header className="page-heading">
        <span className="eyebrow">YOUR SPACE, YOUR WAY</span>
        <h1>A little more you.</h1>
        <p>Find your colors. Set your pace. Make TinySteps feel like home.</p>
      </header>
      <PreferencesPanel />
    </div>
  );
}
