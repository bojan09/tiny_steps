import { Localize } from "@/components/localize";
import Link from "next/link";
import { WifiOff } from "lucide-react";
export const metadata = { title: "Offline" };
export default function Offline() {
  return (
    <div className="page-content narrow">
      <section className="paper content-panel">
        <WifiOff size={32} />
        <h1>
          <Localize>{"A moment to pause."}</Localize>
        </h1>
        <p>
          <Localize>
            {
              "This is TinySteps\u2019 offline page. If your connection is unavailable, your saved appearance choices and introduction progress remain on this device."
            }
          </Localize>
        </p>
        <p>
          <Localize>
            {
              "Full lesson downloads are not available in this foundation release. Connect again to browse the app; sign-in and AI also need a connection."
            }
          </Localize>
        </p>
        <Link href="/" className="button primary">
          <Localize>{"Try returning home"}</Localize>
        </Link>
      </section>
    </div>
  );
}
