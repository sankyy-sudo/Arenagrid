import { ArrowRight } from "lucide-react";
import { useIndustries } from "../hooks/useIndustries";
import { IndustryImage } from "./IndustryImage";
import type { PublicIndustry } from "../../../shared/industries";
import { ButtonLink } from "./ButtonLink";
import { SectionHeader } from "./SectionHeader";
import { HomePhoto } from "./home/HomePhoto";
import { useHomeMotion } from "../hooks/useHomeMotion";
import "../styles/industries.css";

function IndustryGrid({ industries }: { industries: PublicIndustry[] }) {
  const motionRef = useHomeMotion();
  return <div className="industries-grid" ref={motionRef} data-reveal-group>{industries.map(industry => <article className="industry-card" key={industry.id} data-reveal>
    <IndustryImage key={industry.imageUrl} image={industry.imageUrl} name={industry.name} />
    <h3>{industry.name}</h3>
    {industry.description && <p className="industry-copy">{industry.description}</p>}
    {industry.solution && <div className="industry-solution"><h4>Solution</h4><p className="industry-copy">{industry.solution}</p></div>}
    <a className="home-text-link" href="/contact" aria-label={`Discuss a project for ${industry.name}`}>Discuss your project <ArrowRight size={17} aria-hidden="true" /></a>
  </article>)}</div>;
}

export function IndustriesContent() {
  const { industries, loading, error, retry } = useIndustries();
  const motionRef = useHomeMotion();
  return (
    <div className="industries-page home-design" ref={motionRef}>
      <section className="industries-intro industries-container" aria-labelledby="industries-title">
        <div><span className="home-label">Spaces for every community</span><h1 id="industries-title">Industries we serve.</h1><p>Every facility has a different purpose. We help schools, institutions, businesses and communities plan sports spaces around the people who use them.</p><div className="industries-actions"><ButtonLink href="/contact">Discuss Your Facility <ArrowRight size={18} aria-hidden="true" /></ButtonLink><a className="home-text-link" href="#industry-sectors">Find your sector <ArrowRight size={17} aria-hidden="true" /></a></div></div>
        <figure className="industries-photo"><HomePhoto name="community" alt="An outdoor sports space surrounded by a community setting." sizes="(max-width: 767px) 92vw, 46vw" /><figcaption>Different communities.<br />A shared space to play.</figcaption></figure>
      </section>
      <section className="industries-directory" id="industry-sectors" aria-labelledby="industry-sectors-title"><div className="industries-container"><div className="industries-section-heading" data-reveal><span className="home-label">Find your sector</span><h2 id="industry-sectors-title">Built around your people.</h2><p>Explore the priorities that shape your sports facility.</p></div>{loading ? <p role="status">Loading industries...</p> : error ? <div role="alert"><p>{error}</p><button type="button" className="home-text-link" onClick={retry}>Try again</button></div> : industries.length === 0 ? <p>No industries are published yet. Contact us to discuss your facility.</p> : <IndustryGrid industries={industries} />}</div></section>
      <section className="industries-planning industries-container" aria-label="Facility planning"><div data-reveal><SectionHeader eyebrow="A connected approach" title="Your sector sets the brief." copy="Start with your users, available space and operating needs. Then connect the right surface with a practical delivery and maintenance plan." /></div><div className="industries-planning-links" data-reveal><a href="/products"><span><strong>Choose your surface</strong><small>Explore turf, courts, flooring and tracks.</small></span><ArrowRight size={20} aria-hidden="true" /></a><a href="/services"><span><strong>Plan your project</strong><small>From consultation to long-term care.</small></span><ArrowRight size={20} aria-hidden="true" /></a></div></section>
      <section className="industries-cta industries-container" aria-labelledby="industries-cta-title"><div><span className="home-label">Let's plan your space</span><h2 id="industries-cta-title">A sports facility that fits<br />your community.</h2><p>Tell us about your site, users and goals.</p></div><ButtonLink href="/contact" className="home-button">Start Your Enquiry <ArrowRight size={18} aria-hidden="true" /></ButtonLink></section>
    </div>
  );
}
