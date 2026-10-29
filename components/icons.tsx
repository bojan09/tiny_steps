import {
  Home,
  BookOpen,
  CalendarDays,
  House,
  NotebookText,
  Heart,
  Network,
  Route,
  Sparkles,
  Bookmark,
  Download,
  Settings,
  UserRound,
  CircleHelp,
} from "lucide-react";
const icons = {
  home: Home,
  book: BookOpen,
  calendar: CalendarDays,
  house: House,
  guide: NotebookText,
  heart: Heart,
  map: Network,
  journey: Route,
  sparkles: Sparkles,
  bookmark: Bookmark,
  download: Download,
  settings: Settings,
  user: UserRound,
  help: CircleHelp,
};
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const Component = icons[name as keyof typeof icons] || BookOpen;
  return <Component size={size} strokeWidth={1.6} aria-hidden="true" />;
}
export function BrandMark() {
  return (
    <svg viewBox="0 0 44 48" fill="none" aria-hidden="true">
      <path d="M22 43V22" stroke="currentColor" strokeWidth="2" />
      <path d="M22 30C4 30 1 12 7 7c13-1 19 10 15 23Z" fill="#dfab91" />
      <path d="M21 28C16 9 28 0 38 3c3 13-3 24-17 25Z" fill="#7e9d89" />
      <path d="M22 41C10 40 10 30 13 28c8 0 11 7 9 13Z" fill="#416857" />
      <path d="M22 27 32 11" stroke="#436b58" strokeWidth="1.2" />
    </svg>
  );
}
