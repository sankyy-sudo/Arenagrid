import { ArrowRight, Filter, Search } from "lucide-react";
import { ButtonLink } from "../components/ButtonLink";
import { SectionHeader } from "../components/SectionHeader";
import { industries, products, projects, services, sports } from "../content";

type ListingPageProps = {
  title: string;
  kind: string;
};

type ListingCardItem = {
  title: string;
  label: string;
  copy: string;
  image?: string;
};

function getItems(title: string, kind: string): ListingCardItem[] {
  if (title === "Products") {
    return products.map((item) => ({ title: item.name, label: item.category, copy: item.copy, image: item.image }));
  }

  if (title === "Sports & Solutions") {
    return sports.slice(0, 9).map((item) => ({ title: item.name, label: "Sport", copy: item.copy, image: item.image }));
  }

  if (title === "Services") {
    return services.map((item) => ({ title: item.name, label: "Capability", copy: item.copy }));
  }

  if (title === "Industries") {
    return industries.map((item) => ({ title: item.name, label: "Sector", copy: item.copy }));
  }

  if (title === "Projects") {
    return projects.map((item) => ({ title: item.title, label: item.status, copy: `${item.location} - ${item.sport}`, image: item.image }));
  }

  return [
    {
      title: "CMS-ready editorial template",
      label: kind,
      copy: "This section is prepared for reusable CMS cards, filters, search, pagination and detail pages."
    },
    {
      title: "Relationship-led content",
      label: "Architecture",
      copy: "Products, sports, services, projects, resources and FAQs are designed to connect through the data model."
    },
    {
      title: "SEO-ready publishing",
      label: "Growth",
      copy: "Metadata, slugs and status fields are already part of the architecture for future CMS management."
    }
  ];
}

export function ListingPage({ title, kind }: ListingPageProps) {
  const items = getItems(title, kind);

  return (
    <>
      <section className="inner-hero">
        <div>
          <span className="eyebrow">{kind}</span>
          <h1>{title}</h1>
          <p>Premium, CMS-driven discovery pages for Arena Grid Infra content and conversion journeys.</p>
        </div>
      </section>
      <section className="page-shell">
        <div className="filter-bar">
          <label>
            <Search size={18} />
            <input placeholder={`Search ${title.toLowerCase()}`} />
          </label>
          <button>
            <Filter size={18} />
            Filter
          </button>
        </div>
        <SectionHeader eyebrow="Discover" title={`Explore ${title}`} />
        <div className="listing-grid">
          {items.map((item) => (
            <article className="listing-card" key={item.title}>
              {item.image ? <img src={item.image} alt="" loading="lazy" /> : null}
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <a href="/contact">
                Enquire <ArrowRight size={16} />
              </a>
            </article>
          ))}
        </div>
        <div className="pagination">
          <button aria-label="Previous page">Prev</button>
          <span>1</span>
          <button aria-label="Next page">Next</button>
        </div>
        <div className="inline-cta">
          <div>
            <strong>Planning a sport-led project?</strong>
            <p>Send the facility type, location and expected timeline.</p>
          </div>
          <ButtonLink href="/contact" variant="outline">
            Start enquiry
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
