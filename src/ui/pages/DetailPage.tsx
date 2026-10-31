import { ProductDetailContent, ProductDetailSkeleton } from "../components/products/ProductDetailContent";
import { richTextToPlain } from "../../../shared/richText";
import { ProjectDetailContent } from "../components/ProjectDetailContent";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { sectionLabels, type Section } from "../data/catalog";
import { useDetailItems } from "../hooks/useDetailItems";
import "../styles/details.css";
import "../styles/detail-content.css";

function useMetadata(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const created = !meta;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.append(meta); }
    const previousDescription = meta.content;
    document.title = `${title} | Arena Grid Infra`;
    meta.content = richTextToPlain(description).replace(/\s+/g, " ").slice(0, 160);
    return () => { document.title = previousTitle; if (created) meta.remove(); else meta.content = previousDescription; };
  }, [title, description]);
}
export function DetailPage({ section }: { section: Section }) {
  const { slug } = useParams();
  const { items, loading, error, retry } = useDetailItems(section);
  const item = items.find(entry => entry.slug === slug);
  useMetadata(loading ? sectionLabels[section] : error ? "Details unavailable" : item?.name || "Item not found", item?.description || `Explore ${sectionLabels[section].toLowerCase()} from Arena Grid Infra.`);
  return <div className={`detail-page page-shell${section !== "projects" ? " product-detail-page" : ""}`}>
    {loading ? (section !== "projects" ? <ProductDetailSkeleton section={section} /> : <div role="status"><p>Loading details...</p><div className="detail-image detail-image-skeleton" /></div>)
      : error ? <section role="alert"><h1>We couldn't load these details.</h1><p>Please try again in a moment.</p><button type="button" className="button-link button-primary" onClick={retry}>Try again</button><Link className="detail-back" to={`/${section}`}>Back to {sectionLabels[section]}</Link></section>
      : !item ? <section><h1>Item not found</h1><p>This item may have moved or is no longer published.</p><Link className="button-link button-primary" to={`/${section}`}>Back to {sectionLabels[section]}</Link></section>
      : section !== "projects" ? <ProductDetailContent key={`${section}-${item.id}`} section={section} item={item} related={items.filter(other => other.id !== item.id).slice(0, 3)} />
      : <ProjectDetailContent key={`${section}-${item.id}`} item={item} related={items.filter(other => other.id !== item.id).slice(0, 3)} />}
  </div>;
}
