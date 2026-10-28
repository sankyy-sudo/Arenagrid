import { ArrowRight, Check, MoveUpRight } from "lucide-react";
import { services } from "../content";
import { ButtonLink } from "./ButtonLink";
import { useHomeMotion } from "../hooks/useHomeMotion";
import "../styles/services.css";

const serviceDetails: Record<string, { label: string; features: string[] }> = {
  Consultation: { label: "Start with clarity", features: ["Site feasibility and sport mix", "Budget planning", "A practical project roadmap"] },
  Design: { label: "Plan every detail", features: ["Court layouts and line markings", "Drainage and lighting specifications", "Access and space planning"] },
  Construction: { label: "Build a strong foundation", features: ["Civil base and sub-surface work", "Fencing and lighting coordination", "On-site project management"] },
  Installation: { label: "Bring the space to life", features: ["Sports surface installation", "Fixtures and finishing", "Safety checks and handover"] },
  Maintenance: { label: "Keep performance going", features: ["Surface cleaning and repairs", "Lifecycle care", "Long-term maintenance planning"] }
};

export function ServicesContent() {
  const motionRef = useHomeMotion();
  return (
    <div className="services-page home-design" ref={motionRef}>
      <section className="services-intro services-container" aria-labelledby="services-title">
        <div><span className="home-label">From planning to play</span><h1 id="services-title">Services for every<br /><span>stage of your space.</span></h1><p>Plan, build and care for your sports facility with support that connects the details, from the first site review to long-term surface maintenance.</p><ButtonLink href="/contact">Discuss Your Project <ArrowRight size={18} aria-hidden="true" /></ButtonLink></div>
        <aside className="services-overview" aria-label="Our service stages"><span className="home-label">One connected approach</span><ol>{services.map((service, index) => <li key={service.name}><a href={`#service-${service.name.toLowerCase()}`}><span className="services-number">0{index + 1}</span>{service.name}<MoveUpRight size={17} aria-hidden="true" /></a></li>)}</ol><p>Support for new facilities and existing sports spaces.</p></aside>
      </section>
      <section className="services-list-section" aria-labelledby="services-list-title">
        <div className="services-container"><div className="services-section-heading" data-reveal><span className="home-label">What we do</span><h2 id="services-list-title">The right expertise.<br />At the right stage.</h2><p>Explore the support your facility needs.</p></div>
          <div className="services-grid" data-reveal-group>{services.map((service, index) => {
            const Icon = service.icon;
            const detail = serviceDetails[service.name];
            return <article className="service-card" id={`service-${service.name.toLowerCase()}`} key={service.name} data-reveal><div className="service-card-top"><span className="service-icon"><Icon size={26} aria-hidden="true" /></span><span className="services-number">0{index + 1}</span></div><span className="home-label">{detail.label}</span><h3>{service.name}</h3><p>{service.copy}</p><ul>{detail.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul><a className="home-text-link" href="/contact" aria-label={`Discuss ${service.name.toLowerCase()}`}>Discuss this service <ArrowRight size={17} aria-hidden="true" /></a></article>;
          })}<aside className="services-help" data-reveal><span className="home-label">Not sure where to start?</span><h3>Tell us about<br />your space.</h3><p>Share your location, sport mix and project goals. We can help you identify the next step.</p><ButtonLink href="/contact" className="home-button">Start a Conversation <ArrowRight size={18} aria-hidden="true" /></ButtonLink></aside></div>
        </div>
      </section>
      <section className="services-next services-container" aria-labelledby="services-next-title"><div data-reveal><span className="home-label">Your next step</span><h2 id="services-next-title">A better sports space<br />starts with a conversation.</h2><p>Tell us what you want to build, improve or maintain.</p></div><ButtonLink href="/contact" variant="outline">Request a Consultation <ArrowRight size={18} aria-hidden="true" /></ButtonLink></section>
    </div>
  );
}
