import Link from "next/link";
import { UserRound, ShieldCheck, ArrowRight } from "lucide-react";
export const metadata = { title: "Your profile" };
export default function Profile() {
  return (
    <div className="page-content narrow">
      <header className="page-heading">
        <span className="eyebrow">YOUR OWN LITTLE CORNER</span>
        <h1>A little about you</h1>
        <p>You belong here, exactly as you are.</p>
      </header>
      <section className="paper profile-panel">
        <span className="profile-avatar">
          <UserRound size={38} strokeWidth={1.3} />
        </span>
        <h2>Welcome, caregiver.</h2>
        <p>
          You’re exploring TinySteps on this device. No account is needed to
          look around or make the space your own.
        </p>
        <div className="info-note">
          <ShieldCheck size={22} />
          <div>
            <strong>A thoughtful start to your profile</strong>
            <p>
              Account sign-in and secure synchronization are being connected in
              the next development phase. Your Google account has not been
              signed in through this app yet.
            </p>
          </div>
        </div>
        <p>
          Appearance choices and introduction progress stay in this browser. We
          haven’t collected your name, your email, or your baby’s details.
        </p>
        <Link href="/settings" className="button primary">
          Personalize your space <ArrowRight size={17} />
        </Link>
        <Link href="/help" className="text-link">
          About privacy and this release
        </Link>
      </section>
    </div>
  );
}
