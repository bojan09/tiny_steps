import Link from "next/link";
import { WifiOff } from "lucide-react";
export const metadata = { title: "Offline" };
export default function Offline() {
  return (
    <div className="page-content narrow">
      <section className="paper content-panel">
        <WifiOff size={32} />
        <h1>A moment to pause.</h1>
        <p>
          This is TinySteps’ offline page. If your connection is unavailable,
          your saved appearance choices and introduction progress remain on this
          device.
        </p>
        <p>
          Full lesson downloads are not available in this foundation release.
          Connect again to browse the app; sign-in and AI also need a
          connection.
        </p>
        <Link href="/" className="button primary">
          Try returning home
        </Link>
      </section>
    </div>
  );
}
