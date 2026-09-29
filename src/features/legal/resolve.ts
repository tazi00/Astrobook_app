import content from "./content.json";

// Terms + Privacy ka content ek hi JSON (content.json) mein hai. Isi se app
// ka Legal screen banta hai aur scripts/build-legal-pages.ts astrobook.in ke
// liye HTML pages banata hai — taaki Play Console mein dene wali public
// privacy URL aur app ke andar ka text kabhi alag na ho.

export type LegalSection = {
  heading?: string;
  body?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export type LegalDocKey = "terms" | "privacy";

type Entity = typeof content.entity;

// Contact / grievance block — sirf wahi lines jo entity mein bhari hain.
// Kuch bhi khaali ho to fallback: app ka Help & Support.
function buildBlock(entity: Entity, grievance: boolean): string {
  const lines: string[] = [];
  if (grievance) {
    if (entity.grievanceOfficerName) {
      lines.push(`Grievance Officer: ${entity.grievanceOfficerName}`);
    }
    const mail = entity.grievanceOfficerEmail || entity.contactEmail;
    if (mail) lines.push(`Email: ${mail}`);
  } else if (entity.contactEmail) {
    lines.push(`Email: ${entity.contactEmail}`);
  }
  if (entity.address) lines.push(`Address: ${entity.address}`);
  lines.push(
    `You can also reach us any time from Profile > Help & Support in the ${entity.appName} app.`,
  );
  const lead = grievance
    ? "If you have a question, a complaint or a request about your personal information, contact us:"
    : "If you have any questions about these Terms, contact us:";
  return `${lead}\n${lines.join("\n")}`;
}

export function resolveText(text: string, entity: Entity = content.entity): string {
  const values: Record<string, string> = {
    appName: entity.appName,
    operator: entity.operatorName || `the team behind ${entity.appName}`,
    jurisdictionCity: entity.jurisdictionCity,
    contactBlock: buildBlock(entity, false),
    grievanceBlock: buildBlock(entity, true),
  };
  return text.replace(/\{\{(\w+)\}\}/g, (m, key) => values[key] ?? m);
}

export function getLegalDocument(key: LegalDocKey): LegalDocument {
  const doc = content.documents[key] as LegalDocument;
  return {
    title: doc.title,
    intro: resolveText(doc.intro),
    sections: doc.sections.map((s) => ({
      heading: s.heading ? resolveText(s.heading) : undefined,
      body: s.body?.map((t) => resolveText(t)),
      bullets: s.bullets?.map((t) => resolveText(t)),
    })),
  };
}

export const LEGAL_EFFECTIVE_DATE = content.entity.effectiveDate;
export const LEGAL_ENTITY = content.entity;
