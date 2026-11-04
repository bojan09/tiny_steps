import { Localize } from "@/components/localize";
import { PreferencesPanel } from "@/components/preferences-panel";
export const metadata = { title: "Appearance & settings" };
export default function Settings() {
  return (
    <div className="page-content">
      <header className="page-heading">
        <span className="eyebrow">
          <Localize>{"YOUR SPACE, YOUR WAY"}</Localize>
        </span>
        <h1>
          <Localize>{"A little more you."}</Localize>
        </h1>
        <p>
          <Localize>
            {"Find your colors. Set your pace. Make TinySteps feel like home."}
          </Localize>
        </p>
      </header>
      <PreferencesPanel />
    </div>
  );
}
