import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ImageIcon } from "lucide-react";
import { mediaUrl } from "../../services/apiConfig";
import { cleanTitle } from "../data/cardContent";
import "../styles/cards.css";

function CardImage({ image, title, category, imagePosition, secondaryBadge }: { image?: string | null; title: string; category?: string; imagePosition?: string; secondaryBadge?: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "error">(image ? "loading" : "error");
  return <div className="info-card-image" aria-busy={state === "loading"}>
    {state === "loading" && <span className="info-card-skeleton" aria-hidden="true" />}
    {state === "error" ? <span className="info-card-image-fallback" role="img" aria-label={`${title}: image unavailable`}><ImageIcon size={36} aria-hidden="true" /></span>
      : <img src={mediaUrl(image!)} alt={title} width={960} height={720} loading="lazy" decoding="async" style={{ objectPosition: imagePosition }} onLoad={() => setState("loaded")} onError={() => setState("error")} />}
    {category && <span className="info-card-badge">{category}</span>}
    {secondaryBadge && <span className="info-card-secondary-badge">{secondaryBadge}</span>}
  </div>;
}
export function InfoCard({ to, title, shortDescription, image, category, tags = [], imagePosition, secondaryBadge, className = "", headingLevel = 3 }: {
  to: string; title: string; shortDescription: string; image?: string | null; category?: string; tags?: string[]; imagePosition?: string; secondaryBadge?: string; className?: string; headingLevel?: 2 | 3;
}) {
  const name = cleanTitle(title);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return <Link to={to} aria-label={`View details for ${name}`} className={`info-card ${className}`}>
    <CardImage key={image || "empty"} image={image} title={name} category={category} imagePosition={imagePosition} secondaryBadge={secondaryBadge} />
    <div className="info-card-body"><Heading className="info-card-title">{name}</Heading><p className="info-card-description">{shortDescription}</p>
      <div className="info-card-footer"><ul className="info-card-tags" aria-label="Applications and details">{tags.filter(Boolean).slice(0, 3).map((tag, index) => <li key={`${tag}-${index}`} title={tag}>{tag}</li>)}</ul>
        <span className="info-card-affordance">View details <ArrowRight size={18} aria-hidden="true" /></span>
      </div>
    </div>
  </Link>;
}
