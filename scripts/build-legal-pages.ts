// @ts-nocheck — Node-only script (tsx se chalta hai); app ke tsconfig mein Node types nahi hain.
/**
 * astrobook.in ke liye Terms + Privacy ke static HTML pages banata hai —
 * SAME content.json se jisse app ka Legal screen banta hai.
 *
 *   npx tsx scripts/build-legal-pages.ts
 *
 * Output: legal-web/privacy-policy.html, legal-web/terms-and-conditions.html
 * Inhe website pe host karo; Play Console ke "Privacy policy" field mein
 * privacy-policy.html ka public URL dena hai.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  LEGAL_EFFECTIVE_DATE,
  LEGAL_ENTITY,
  getLegalDocument,
  type LegalDocKey,
} from "../src/features/legal/resolve";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const para = (s: string) => `<p>${esc(s).replace(/\n/g, "<br>")}</p>`;

function page(key: LegalDocKey): string {
  const doc = getLegalDocument(key);
  const body = doc.sections
    .map((s) =>
      [
        s.heading ? `<h2>${esc(s.heading)}</h2>` : "",
        ...(s.body ?? []).map(para),
        s.bullets?.length
          ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
          : "",
      ].join("\n"),
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(doc.title)} | ${esc(LEGAL_ENTITY.appName)}</title>
<style>
  body{margin:0;background:#f5f0ff;color:#2b2540;font:16px/1.7 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  header{background:#9d0399;color:#fff;padding:28px 20px}
  header div,main{max-width:760px;margin:0 auto}
  header h1{margin:0;font-size:26px}
  header p{margin:4px 0 0;opacity:.85;font-size:14px}
  main{background:#fff;margin:-14px auto 40px;padding:28px 22px;border-radius:16px;box-shadow:0 1px 4px #0001}
  h2{font-size:18px;margin:28px 0 6px;color:#1a1a2e}
  ul{padding-left:22px}
  li{margin:4px 0}
  a{color:#9d0399}
  @media(min-width:800px){main{padding:36px 40px}}
</style>
</head>
<body>
<header><div><h1>${esc(doc.title)}</h1><p>${esc(LEGAL_ENTITY.appName)} &middot; Last updated ${esc(LEGAL_EFFECTIVE_DATE)}</p></div></header>
<main>
${para(doc.intro)}
${body}
</main>
</body>
</html>
`;
}

const outDir = join(__dirname, "..", "legal-web");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "privacy-policy.html"), page("privacy"));
writeFileSync(join(outDir, "terms-and-conditions.html"), page("terms"));
console.log("Written to", outDir);
