// "vedic-astrology" → "Vedic Astrology"
export function prettyTag(tag: string): string {
  return tag
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
