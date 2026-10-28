import { ArrowRight } from "lucide-react";
import { capabilityCards, services } from "../../content";
import { SectionHeader } from "../SectionHeader";

export function HomeDelivery() {
  return (
    <section className="home-section home-delivery" id="project-delivery">
      <div className="home-container">
        <div className="home-section-top" data-reveal>
          <SectionHeader eyebrow="A plan for every stage" title="From first conversation to first game."
            copy="Planning, engineering and installation, brought together around your site and the way it will be used." />
          <a className="home-text-link" href="/services">Our services <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <ol className="home-delivery-steps" data-reveal-group>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <li key={service.name} data-reveal>
                <div className="home-step-top" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span><Icon size={25} /></div>
                <h3>{service.name}</h3><p>{service.copy}</p>
              </li>
            );
          })}
        </ol>
        <div className="home-benefits">
          <div className="home-benefits-intro" data-reveal><h3>Care in the details.<br />Confidence in the result.</h3><a className="home-text-link" href="/about">Why Arena Grid <ArrowRight size={17} aria-hidden="true" /></a></div>
          <div className="home-benefit-list" data-reveal-group>
            {capabilityCards.map((card) => {
              const Icon = card.icon;
              return <article key={card.title} data-reveal><span aria-hidden="true"><Icon size={23} /></span><div><h4>{card.title}</h4><p>{card.copy}</p></div></article>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
