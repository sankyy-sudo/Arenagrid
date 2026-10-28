import { ArrowRight, Plus, Building2 } from "lucide-react";
import { useIndustries } from "../../hooks/useIndustries";
import { SectionHeader } from "../SectionHeader";
import { HomePhoto } from "./HomePhoto";

export function HomeCommunity() {
  return (
    <section className="home-section home-community" id="spaces-for-people">
      <div className="home-container home-community-grid">
        <figure className="home-community-photo" data-reveal>
          <HomePhoto name="community" alt="People playing basketball on outdoor courts as the sun sets behind palm trees."
            sizes="(max-width: 900px) 100vw, 50vw" />
          <figcaption>More than a place to play.</figcaption>
        </figure>
        <div data-reveal>
          <SectionHeader eyebrow="Spaces for people" title="Built around your community."
            copy="A school day. An academy session. An evening game with neighbours. Plan a sports space around the people who will make it their own." />
          <HomeIndustryList />
          <a className="home-text-link" href="/industries">Explore the sectors we serve <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

function HomeIndustryList() {
  const { industries, loading, error, retry } = useIndustries();
  if (loading) return <p role="status">Loading industries...</p>;
  if (error) return <div role="alert"><p>{error}</p><button type="button" className="home-text-link" onClick={retry}>Try again</button></div>;
  if (!industries.length) return <p>Industries will be listed here when published.</p>;
  return <div className="home-industry-list">{industries.map(industry => <details key={industry.id}>
    <summary><span aria-hidden="true"><Building2 size={19} /></span><span>{industry.name}</span><Plus size={16} aria-hidden="true" /></summary>
    {industry.description && <p>{industry.description}</p>}
    {industry.solution && <p><strong>Solution: </strong>{industry.solution}</p>}
  </details>)}</div>;
}
