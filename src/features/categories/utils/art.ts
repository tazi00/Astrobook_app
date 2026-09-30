// Category card ka generated "background art" — koi image asset nahi chahiye.
// Har category ka apna rang; usse gradient + tare + rings bante hain.

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** amt > 0 → white ki taraf, amt < 0 → black ki taraf (−1..1) */
export function shade(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const ch = (c: number) => Math.round((t - c) * p + c);
  return `rgb(${ch(r)},${ch(g)},${ch(b)})`;
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Star = { x: number; y: number; size: number; opacity: number };

/** Same id → hamesha same tare (re-render pe jump nahi karte) */
export function starsFor(id: string, count = 9): Star[] {
  let seed = hash(id);
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 1.5 + rand() * 2,
    opacity: 0.25 + rand() * 0.55,
  }));
}
