// Explicit app origins: redirects never trust an arbitrary Host or forwarded host.
export const appOrigins = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "https://tiny-steps-six.vercel.app",
];
export function appOriginForHost(host: string | null): string | undefined {
  return appOrigins.find((origin) => new URL(origin).host === host);
}
export function isSameAppOrigin(origin: string | null, host: string | null) {
  return !!origin && origin === appOriginForHost(host);
}
