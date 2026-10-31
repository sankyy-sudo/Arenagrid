import { richTextToPlain } from "../../../../shared/richText";
import { useProducts } from "../../hooks/useProducts";
import { ArrowRight } from "lucide-react";
import { useSports } from "../../hooks/useSports";
import { SectionHeader } from "../SectionHeader";
import { SportImage } from "../SportImage";

export function HomeDiscovery() {
  return (
    <section className="home-section home-discovery" id="sports-and-surfaces">
      <div className="home-container">
        <div className="home-section-top" data-reveal>
          <SectionHeader eyebrow="Find your field of play" title="Your sport. Your space."
            copy="From the first kick to the final lap, start with the right surface, layout and support for your sport." />
          <a className="home-text-link" href="/sports">Explore sports & solutions <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <HomeSportList />
        <div className="home-products">
          <div data-reveal>
            <SectionHeader eyebrow="From the ground up" title="The right surface changes everything."
              copy="Explore product systems designed around how your facility will be used, maintained and enjoyed." />
            <a className="home-text-link" href="/products">Explore product systems <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <HomeProductList />
        </div>
      </div>
    </section>
  );
}

function HomeProductList() {
  const { products, loading, error, retry } = useProducts();
  if (loading) return <p role="status">Loading product systems...</p>;
  if (error) return <div role="alert"><p>{error}</p><button className="button-link button-outline" type="button" onClick={retry}>Try again</button></div>;
  if (!products.length) return <p>Product systems will be listed here when published.</p>;
  return <ol className="home-product-list">{products.map((product, index) => <li key={product.id}>
    <span className="home-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
    <div><span className="home-label">{product.category?.name}</span><h3>{product.name}</h3><p>{richTextToPlain(product.fullDescription || product.shortDescription)}</p></div>
  </li>)}</ol>;
}

function HomeSportList() {
  const { sports, loading, error, retry } = useSports();
  if (loading) return <p role="status">Loading sports...</p>;
  if (error) return <div role="alert"><p>{error}</p><button type="button" className="home-text-link" onClick={retry}>Try again</button></div>;
  if (!sports.length) return <p>Sports will be listed here when published.</p>;
  return <div className="home-sports-grid">{sports.map(sport => <article className="home-sport-card" key={sport.id}>
    <div className="home-sport-card__image"><SportImage key={sport.heroImageUrl} image={sport.heroImageUrl} name={sport.name} /></div>
    <h3>{sport.name}</h3><p>{richTextToPlain(sport.longDescription || sport.shortDescription)}</p>
    <a className="home-text-link" href="/contact" aria-label={`Plan your space: ${sport.name}`}>Plan your space <ArrowRight size={16} aria-hidden="true" /></a>
  </article>)}</div>;
}
