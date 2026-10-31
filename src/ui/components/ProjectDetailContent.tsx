import { DetailRichText, DetailSpecifications } from "./DetailRichText";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DetailImage } from "./DetailImage";
import { InfoCard } from "./InfoCard";

import { detailHref, type DetailItem } from "../data/catalog";
import "../styles/project-detail.css";

export function ProjectDetailContent({ item, related }: { item: DetailItem; related: DetailItem[] }) {
  const project = item.project;
  return <article className="project-detail-stacked">
    <Link className="detail-back" to="/projects"><ArrowLeft size={18} aria-hidden="true" />Back to Projects</Link>
    <header className="project-detail-heading">
      <h1>{item.name}</h1>
      <ul className="project-detail-chips" aria-label="Project information">
        {project?.status && <li>{project.status}</li>}
        {project?.isDemo && <li>Demo project</li>}
        {project?.location && <li>{project.location}</li>}
      </ul>
    </header>
    <section className="project-detail-comparison" aria-label="Before and after">
      {[{ label: "Before", url: project?.beforeImageUrl }, { label: "After", url: project?.afterImageUrl }].map(photo =>
        <figure key={photo.label}>
          <DetailImage key={photo.url || photo.label} url={photo.url || undefined} alt={`${item.name} — ${photo.label}`} />
          <figcaption>{photo.label}</figcaption>
        </figure>)}
    </section>
    <div className="detail-content">
    <section className="project-detail-content" aria-labelledby="project-description-heading">
      <h2 id="project-description-heading">Description</h2>
      <DetailRichText content={item.description || "Contact our team for more information about this project."} />
    </section>
    <DetailSpecifications specs={item.specs} />
    <Link className="button-link button-primary detail-content-contact" to={`/contact?subject=${encodeURIComponent(item.name)}`}>Contact us</Link>
    </div>
    {related.length > 0 && <section className="detail-related"><h2>Related projects</h2><div className="detail-related-grid">{related.map(other => <InfoCard key={other.id} title={other.name} to={detailHref("projects", other)} image={other.project?.afterImageUrl || other.project?.beforeImageUrl} shortDescription={other.shortDescription} category={other.project?.status} secondaryBadge={other.project?.isDemo ? "DEMO" : undefined} className="project-detail-related-card" />)}</div></section>}
  </article>;
}
