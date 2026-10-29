import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/app-shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "TinySteps — A gentler beginning",
    template: "%s · TinySteps",
  },
  description:
    "A thoughtful space to grow your confidence as a parent. Small steps, a brighter tomorrow.",
  applicationName: "TinySteps",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "TinySteps" },
  icons: { icon: "/icons/icon.svg", apple: "/icons/apple-touch-icon.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f5ef",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
