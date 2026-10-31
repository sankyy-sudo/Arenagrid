import { CardGrid } from "./CardGrid";
import { cardSummary } from "../data/cardContent";
import { InfoCard } from "./InfoCard";
import { detailHref } from "../data/catalog";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useSports } from "../hooks/useSports";
import type { PublicSport } from "../../../shared/sports";
import { ButtonLink } from "./ButtonLink";
import { HomePhoto } from "./home/HomePhoto";
import "../styles/sports.css";

function SportsGrid({ query, sports }: { query: string; sports: PublicSport[] }) {
  const matches = sports.filter(sport => `${sport.name} ${sport.longDescription || sport.shortDescription || ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <><p className="sports-count" role="status">{matches.length} {matches.length === 1 ? "sport or space" : "sports and spaces"}</p><CardGrid className="sports-grid compact-catalog-grid">{matches.map(sport => <InfoCard key={sport.id} to={detailHref("sports", sport)} title={sport.name} shortDescription={cardSummary({ ...sport, description: sport.longDescription })} image={sport.heroImageUrl} category="Sports infrastructure" className="sport-solution" />)}</CardGrid>{matches.length === 0 && <div className="sports-empty"><h3>No matching sports found.</h3><p>Try another sport name, or tell us about your facility.</p><ButtonLink href="/contact" variant="outline">Discuss Your Requirements</ButtonLink></div>}</>;
}

export function SportsContent() {
  const [query, setQuery] = useState("");
  const { sports, loading, error, retry } = useSports();
  return <div className="sports-page home-design"><section className="sports-intro sports-container" aria-labelledby="sports-title"><div><span className="home-label">Sports &amp; solutions</span><h1 id="sports-title">Your sport.{" "}<br /><span>Your space to play.</span></h1><p>From a single court to a multi-sport facility, explore surfaces and infrastructure designed around how you play.</p><div className="sports-intro-actions"><ButtonLink href="#sports-directory">Explore Sports <ArrowRight size={18} aria-hidden="true" /></ButtonLink><a className="home-text-link" href="/contact">Discuss your project <ArrowRight size={17} aria-hidden="true" /></a></div></div><figure className="sports-intro-photo"><HomePhoto name="tennis" alt="A tennis net above a blue court with clearly marked playing lines." sizes="(max-width: 767px) 92vw, 46vw" /><figcaption>The right surface.<br />A better place to play.</figcaption></figure></section>
    <section className="sports-directory" id="sports-directory" aria-labelledby="sports-directory-title"><div className="sports-container"><div className="sports-directory-heading"><div><span className="home-label">Find your game</span><h2 id="sports-directory-title">Explore sports and spaces.</h2><p>Choose a sport to start the conversation about your facility.</p></div><div className="sports-search"><label htmlFor="sport-search">Search sports</label><div><Search size={18} aria-hidden="true" /><input id="sport-search" type="search" placeholder="Try tennis, indoor or turf" value={query} onChange={event => setQuery(event.target.value)} /></div></div></div>{loading ? <p role="status">Loading sports...</p> : error ? <div role="alert"><p>{error}</p><button type="button" className="home-text-link" onClick={retry}>Try again</button></div> : sports.length === 0 ? <p>No sports are published yet. Contact us to discuss your facility.</p> : <SportsGrid key={query} query={query} sports={sports} />}</div></section>
    <section className="sports-pathways sports-container" aria-labelledby="sports-pathways-title"><div><span className="home-label">From sport to specification</span><h2 id="sports-pathways-title">Bring the whole<br />facility together.</h2><p>Connect your sport with the surface system and project support it needs.</p></div><div><a href="/products"><span><strong>Explore surface systems</strong><small>Turf, court surfaces, indoor flooring and tracks.</small></span><ArrowRight size={20} aria-hidden="true" /></a><a href="/services"><span><strong>Plan delivery and care</strong><small>Consultation, design, construction, installation and maintenance.</small></span><ArrowRight size={20} aria-hidden="true" /></a></div></section>
    <section className="sports-cta sports-container" aria-labelledby="sports-cta-title"><div><span className="home-label">Let's plan your facility</span><h2 id="sports-cta-title">One sport or many.<br />Let's make room for play.</h2><p>Share your location, available area and the sports you have in mind.</p></div><ButtonLink href="/contact" className="home-button">Start Your Enquiry <ArrowRight size={18} aria-hidden="true" /></ButtonLink></section></div>;
}
