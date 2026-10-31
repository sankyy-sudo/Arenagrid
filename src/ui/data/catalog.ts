import { richTextToPlain } from "../../../shared/richText";
import { cardSummary, cleanTitle } from "./cardContent";
import type { PublicProduct } from "../../../shared/products";

import type { PublicProject } from "../../../shared/projects";

import type { PublicSport } from "../../../shared/sports";

import type { PublicIndustry } from "../../../shared/industries";



export type Section = "products" | "projects" | "sports" | "industries";

export const sectionLabels: Record<Section, string> = { products: "Products", projects: "Projects", sports: "Sports", industries: "Industries" };

export function itemSlug(item: { slug?: string; name: string; id: string }) {

  return item.slug || item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || item.id;

}

export const detailHref = (section: Section, item: { slug?: string; name: string; id: string }) => `/${section}/${encodeURIComponent(itemSlug(item))}`;

export type DetailItem = { id: string; slug: string; name: string; shortDescription: string; tagline: string; description: string; solution?: string | null; project?: { beforeImageUrl: string | null; afterImageUrl: string | null; isDemo: boolean; status: string; location: string }; images: { url: string; alt: string }[]; specs: { name: string; value: string }[]; features: string[]; applications: string[] };

const base = (item: { id: string; slug: string; name: string }): DetailItem => ({ id: item.id, slug: itemSlug(item), name: cleanTitle(item.name), shortDescription: "", tagline: "", description: "", images: [], specs: [], features: [], applications: [] });

function images(values: { url: string | null; alt: string }[]) { return values.filter((image): image is { url: string; alt: string } => Boolean(image.url)).filter((image, index, all) => all.findIndex(other => other.url === image.url) === index); }

export function productDetail(item: PublicProduct): DetailItem {

  return { ...base(item), shortDescription: cardSummary({ ...item, description: item.fullDescription }), tagline: item.category?.name || "", description: richTextToPlain(item.fullDescription).trim() ? item.fullDescription! : item.shortDescription || "",

    images: images([{ url: item.mainImageUrl, alt: item.name }, ...(item.gallery ?? []).map(image => ({ url: image.url, alt: image.altText || item.name }))]),

    specs: item.specifications.map(spec => ({ name: spec.name, value: `${spec.value}${spec.unit ? ` ${spec.unit}` : ""}` })), features: item.features, applications: item.bestFor };

}

export function projectDetail(item: PublicProject): DetailItem {
  const location = (item.location || "").replace(/\s*[^\p{L}\p{N}]*\s*illustrative location.*$/iu, "").trim();
  const status = item.progress === 100 ? "Completed" : "Ongoing";
  return { ...base(item), name: cleanTitle(item.name).replace(/^demo:\s*/i, ""), shortDescription: cardSummary(item), tagline: location, description: item.description || "",
    project: { beforeImageUrl: item.beforeImageUrl, afterImageUrl: item.afterImageUrl, isDemo: /^demo:\s*/i.test(item.name), status, location },

    images: images([{ url: item.afterImageUrl, alt: `${item.name} - After` }, { url: item.beforeImageUrl, alt: `${item.name} - Before` }, ...(item.gallery ?? []).map(image => ({ url: image.url, alt: image.altText || item.name }))]),

    specs: [{ name: "Location", value: location }, { name: "Status", value: status }, { name: "Surface", value: item.surface?.trim() || "" }, { name: "Use", value: item.use?.trim() || "" }].filter(spec => spec.value) };

}

export function sportDetail(item: PublicSport): DetailItem { return { ...base(item), shortDescription: cardSummary({ ...item, description: item.longDescription }), tagline: item.shortDescription || "", description: richTextToPlain(item.longDescription).trim() ? item.longDescription! : item.shortDescription || "", images: images([{ url: item.heroImageUrl, alt: item.name }]) }; }

export function industryDetail(item: PublicIndustry): DetailItem { return { ...base(item), shortDescription: cardSummary(item), description: item.description || "", solution: item.solution, images: images([{ url: item.imageUrl, alt: item.name }]) }; }

