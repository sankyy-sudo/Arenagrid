import { DetailRichText, DetailSpecifications } from "../DetailRichText";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { InfoCard } from "../InfoCard";
import { detailHref, sectionLabels, type DetailItem, type Section } from "../../data/catalog";
import { ProductGallery } from "./ProductGallery";

import "../../styles/product-detail.css";

export function ProductDetailSkeleton({ section = "products" }: { section?: Section }) {
  return <div className="product-detail-skeleton" role="status" aria-label={`Loading ${sectionLabels[section].toLowerCase()} details`}><span className="product-skeleton-line" /><span className="product-skeleton-title" /><div className="detail-image detail-image-skeleton" /><div className="product-skeleton-copy">{[0,1,2,3].map(line => <span className="product-skeleton-line" key={line} />)}</div></div>;
}
export function ProductDetailContent({ item, related, section = "products" }: { item: DetailItem; related: DetailItem[]; section?: Exclude<Section, "projects"> }) {
  const label = sectionLabels[section];
  const quoteHref = `/contact?subject=${encodeURIComponent(item.name)}`;
  const whatsappHref = `https://wa.me/919716964745?text=${encodeURIComponent(`Hello Arena Grid Infra, I would like to discuss ${item.name} for my project.`)}`;
  const category = section === "products" ? item.tagline || "Sports surface systems" : section === "sports" ? "Sports & solutions" : "Industry solutions";
  return <>
    <nav className="detail-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to={`/${section}`}>{label}</Link><span aria-hidden="true">/</span><span aria-current="page">{item.name}</span></nav>
    <Link className="detail-back" to={`/${section}`}><ArrowLeft size={16} aria-hidden="true" />Back to {label}</Link>
    <header className="product-detail-title"><span className="home-label">{category}</span><h1>{item.name}</h1></header>
    <ProductGallery images={item.images} name={item.name} />
    <div className="detail-content detail-content-after-gallery">
      <section className="product-detail-description" aria-labelledby="product-description-heading"><h2 id="product-description-heading">Description</h2><DetailRichText className="product-prose" content={item.description || "Contact our team to discuss the right solution for your facility."} /></section>
      {item.solution && <section className="product-detail-solution" aria-labelledby="detail-solution-heading"><h2 id="detail-solution-heading">Solution</h2><DetailRichText className="product-prose" content={item.solution} /></section>}
      <DetailSpecifications specs={item.specs} />
      <div className="detail-content-actions"><Link className="button-link button-primary detail-content-contact" to={quoteHref}>Contact us <ArrowUpRight size={18} aria-hidden="true" /></Link><a className="product-whatsapp-link" href={whatsappHref} target="_blank" rel="noopener noreferrer"><FaWhatsapp size={20} aria-hidden="true" />Chat on WhatsApp</a></div>
    </div>
    {related.length > 0 && <section className="detail-related"><h2>Related {label.toLowerCase()}</h2><div className="detail-related-grid">{related.map(other => <InfoCard key={other.id} title={other.name} to={detailHref(section, other)} image={other.images[0]?.url} shortDescription={other.shortDescription} category={section === "products" ? other.tagline || label : category} tags={other.applications} className="detail-related-card" />)}</div></section>}
    <div className="product-mobile-quote" aria-label={`${label} enquiry`}><Link className="button-link button-primary" to={quoteHref}>Get a Quote <ArrowUpRight size={18} aria-hidden="true" /></Link><a className="product-whatsapp-link" href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={`Enquire about ${item.name} on WhatsApp`}><FaWhatsapp size={20} aria-hidden="true" />WhatsApp</a></div>
  </>;
}
