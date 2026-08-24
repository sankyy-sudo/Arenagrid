import { ArrowRight, CalendarDays, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { ButtonLink } from "../components/ButtonLink";
import { Card } from "../components/Card";
import { FAQAccordion } from "../components/FAQAccordion";
import { SectionHeader } from "../components/SectionHeader";
import { capabilityCards, industries, products, projects, services, sports, testimonials } from "../content";

const partners = ["Turf Systems", "Court Coatings", "Lighting Works", "Drainage Labs", "Surface Care", "Arena Safety"];
const resources = [
  "Choosing the right surface for a school campus",
  "Football turf maintenance checklist",
  "How to plan a multi-sport residential amenity"
];

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-media-panel" aria-hidden="true">
          <span>CAD</span>
          <strong>Field layout package</strong>
          <small>Surface - Base - Drainage - Lighting</small>
        </div>
        <div className="hero-content">
          <p className="eyebrow">Premium sports infrastructure</p>
          <h1>
            BUILDING SPACES.
            <br />
            ENHANCING PLAY.
            <br />
            BUILDING FUTURES.
          </h1>
          <p>
            Complete sports infrastructure solutions from planning and design to construction, installation and long-term
            maintenance.
          </p>
          <div className="hero-actions">
            <ButtonLink href="/sports">
              Explore Solutions <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Start Your Project
            </ButtonLink>
          </div>
        </div>
        <div className="stats-strip" aria-label="Company capability highlights">
          <span>
            <strong>360</strong> degree delivery
          </span>
          <span>
            <strong>12+</strong> sport formats
          </span>
          <span>
            <strong>B2B</strong> project focus
          </span>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Arena Grid Infra"
          title="A sports facility partner for institutions that need certainty"
          copy="We combine engineering discipline, sport-specific product systems and project execution into one coordinated delivery model."
        />
        <div className="value-grid">
          <article>
            <ShieldCheck size={28} />
            <h3>Technical confidence</h3>
            <p>Base preparation, surface selection, drainage, lighting and safety details are planned together.</p>
          </article>
          <article>
            <Ruler size={28} />
            <h3>Configured by sport</h3>
            <p>Each sport can connect to recommended products, services, specifications and project references.</p>
          </article>
          <article>
            <CalendarDays size={28} />
            <h3>Lifecycle thinking</h3>
            <p>Maintenance, warranties and future usage are considered before the first line is marked.</p>
          </article>
        </div>
      </section>

      <section className="section muted">
        <SectionHeader
          eyebrow="Explore sports"
          title="Sport-specific infrastructure pathways"
          copy="Every sport needs the right surface, base, markings, accessories and maintenance plan."
        />
        <div className="sport-grid">
          {sports.map((sport) => (
            <a className="sport-card" href="/sports" key={sport.name}>
              <img src={sport.image} alt={`${sport.name} facility surface`} loading="lazy" />
              <span>{sport.name}</span>
              <p>{sport.copy}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="Featured products" title="Systems built for performance and daily durability" />
        <div className="card-grid product-grid">
          {products.map((product) => (
            <Card key={product.name} label={product.category} title={product.name} copy={product.copy} image={product.image} imageAlt={`${product.name} installation`} />
          ))}
        </div>
      </section>

      <section className="process section graphite-band">
        <SectionHeader
          eyebrow="Services"
          title="From first site walk to long-term maintenance"
          copy="A controlled delivery sequence keeps decisions visible and execution accountable."
        />
        <div className="process-steps">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
            <div key={service.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon size={28} />
              <strong>{service.name}</strong>
              <p>{service.copy}</p>
            </div>
            );
          })}
        </div>
      </section>

      <section className="section split-section">
        <div>
          <SectionHeader
            eyebrow="Why Arena Grid"
            title="Premium quality without losing practical site discipline"
            copy="The brand promise is simple: deliver sports spaces that look sharp on opening day and keep performing under real usage."
          />
          <ButtonLink href="/about" variant="outline">
            About the company
          </ButtonLink>
        </div>
        <div className="capability-grid">
          {capabilityCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title}>
                <Icon size={25} />
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section muted">
        <SectionHeader eyebrow="Industries" title="Built for repeat use, inspection and institutional trust" />
        <div className="industry-grid">
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <a href="/industries" key={industry.name}>
                <Icon size={24} />
                <strong>{industry.name}</strong>
                <p>{industry.copy}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="section projects-section">
        <SectionHeader
          eyebrow="Featured projects"
          title="Portfolio-ready project presentation"
          copy="Project pages are prepared for sport, location, type, status, products used and case-study style outcomes."
        />
        <div className="project-layout">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <img src={project.image} alt={`${project.title} sports infrastructure project`} loading="lazy" />
              <div>
                <span>{project.status}</span>
                <h3>{project.title}</h3>
                <p>
                  <MapPin size={15} /> {project.location}
                </p>
                <p>{project.sport}</p>
                <strong>{project.type}</strong>
                <a href="/projects">View project</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section case-study-band">
        <SectionHeader eyebrow="Case studies" title="Challenge to outcome storytelling" />
        <div className="case-flow">
          {["Challenge", "Requirement", "Solution", "Implementation", "Outcome"].map((step) => (
            <div key={step}>{step}</div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="Partners & certifications" title="A supply network designed for accountable delivery" />
        <div className="partner-marquee" aria-label="Partner categories">
          {partners.concat(partners).map((partner, index) => (
            <span key={`${partner}-${index}`}>{partner}</span>
          ))}
        </div>
      </section>

      <section className="section testimonial-section">
        <SectionHeader eyebrow="Testimonials" title="Trusted by project owners who need execution clarity" />
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name}>
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section muted resources-section">
        <SectionHeader eyebrow="Resources" title="Guides, project thinking and product knowledge" />
        <div className="resource-grid">
          {resources.map((resource) => (
            <a href="/resources" key={resource}>
              <span>Guide</span>
              <strong>{resource}</strong>
              <ArrowRight size={18} />
            </a>
          ))}
        </div>
      </section>

      <section className="section faq-section">
        <SectionHeader eyebrow="FAQs" title="Common early project questions" />
        <FAQAccordion />
      </section>

      <section className="final-cta">
        <div>
          <span className="eyebrow">Start your project</span>
          <h2>Bring your next sports facility from idea to playable space.</h2>
          <p>Share your site, sport mix, timeline and goals. Arena Grid Infra will shape the next step.</p>
        </div>
        <ButtonLink href="/contact">
          Request consultation <ArrowRight size={18} />
        </ButtonLink>
      </section>
    </>
  );
}
