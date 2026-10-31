// Inspect visible server-rendered text, not React scripts or comment markers.
export function matchesReleaseVersion(html, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) return false;
  const text = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ");
  return new RegExp(
    "\\bVersion\\s+" + version.replaceAll(".", "\\.") + "\\b",
  ).test(text);
}
