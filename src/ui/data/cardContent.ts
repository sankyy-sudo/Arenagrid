import { richTextToPlain } from "../../../shared/richText";
export function cleanTitle(title: string) { return title.replace(/^sample:\s*/i, "").trim(); }

const sampleSummaries: Record<string, string> = {
  "sample-football-surface": "Durable synthetic turf for football and futsal, with drainage planning and custom field markings.",
  "sample-tennis-surface": "Layered acrylic surfacing for outdoor tennis courts, with textured finishes and custom playing-area colours.",
  "sample-basketball-surface": "Outdoor basketball surfacing with clear court markings and coordinated drainage and hoop foundations.",
  "sample-indoor-surface": "Wooden sports flooring for indoor training halls, with support systems and markings suited to shared activities.",
  "sample-athletics-surface": "Synthetic running surfaces for schools and training campuses, with planned lane markings and drainage edges.",
  "sample-football": "Football and futsal facilities planned around player numbers, site conditions and daily training needs.",
  "sample-tennis": "Tennis courts with coordinated playing surfaces, run-off areas, drainage and fencing.",
  "sample-basketball": "Basketball spaces for schools and communities, with practical layouts for coaching and recreation.",
  "sample-indoor": "Flexible indoor halls with coordinated flooring, court markings and equipment layouts for multiple activities.",
  "sample-athletics": "Running tracks planned around training programmes, available land and supporting athletics areas.",
  "demo-football-project": "An illustrative community football arena with synthetic turf, drainage and perimeter planning. This is a demo project.",
  "demo-tennis-project": "An illustrative academy tennis-court upgrade with acrylic surfacing and renewed markings. This is a demo project.",
  "demo-basketball-project": "An illustrative school basketball facility with outdoor surfacing and coordinated hoop locations. This is a demo project.",
  "demo-indoor-project": "An illustrative indoor training hall with wooden flooring and shared court markings. This is a demo project.",
  "demo-athletics-project": "An illustrative campus running track with synthetic surfacing and lane markings. This is a demo project."
};

export function cardSummary(item: { slug?: string; shortDescription?: string | null; description?: string | null }) {
  const existingCopy = item.shortDescription || item.description || "";
  if (/\b(sample|demo project|placeholder)\b/i.test(existingCopy) && item.slug && sampleSummaries[item.slug]) return sampleSummaries[item.slug];
  for (const candidate of [item.shortDescription, item.description]) {
    const text = richTextToPlain(candidate).replace(/\s+/g, " ").trim();
    if (!text) continue;
    const completeText = text.split(/\.{3}|\u2026/)[0];
    const sentences = completeText.match(/[^.!?]+[.!?](?:\s|$)/g)?.map(sentence => sentence.trim()).filter(sentence => !/\b(sample|placeholder|demo project)\b|\.\.\./i.test(sentence));
    if (sentences?.length) return sentences.slice(0, 2).join(" ");
    if (text.length <= 160 && !/sample|placeholder|\.\.\.|\u2026/i.test(text)) return `${text.replace(/[.!?]+$/, "")}.`;
  }
  return "Explore surface options and facility planning with our team.";
}
