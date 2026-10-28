import { ArrowRight, MoveUpRight } from "lucide-react";
import { ButtonLink } from "../ButtonLink";

export function HomeHero() {
  return (
    <section className="home-design home-hero" aria-labelledby="home-hero-title">
      <picture className="home-hero__picture">
        <source
          type="image/avif"
          media="(max-width: 640px)"
          srcSet="/images/home/arena-field-mobile-small.avif 480w, /images/home/arena-field-mobile.avif 768w"
          sizes="100vw"
          width="768"
          height="1152"
        />
        <source
          type="image/webp"
          media="(max-width: 640px)"
          srcSet="/images/home/arena-field-mobile-small.webp 480w, /images/home/arena-field-mobile.webp 768w"
          sizes="100vw"
          width="768"
          height="1152"
        />
        <source
          type="image/avif"
          srcSet="/images/home/arena-field-medium.avif 1280w, /images/home/arena-field-wide.avif 1920w"
          sizes="100vw"
          width="1920"
          height="1280"
        />
        <img
          src="/images/home/arena-field-wide.webp"
          srcSet="/images/home/arena-field-medium.webp 1280w, /images/home/arena-field-wide.webp 1920w"
          sizes="100vw"
          width="1920"
          height="1280"
          alt="Aerial view of a marked football pitch and adjacent court framed by palm trees."
          fetchPriority="high"
          loading="eager"
        />
      </picture>

      <div className="home-hero__inner">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow home-hero__enter">Sports infrastructure. From the ground up.</p>
          <h1 id="home-hero-title" className="home-hero__title home-hero__enter">
            <span>Built for play.</span>{" "}
            <span>Made to last.</span>
          </h1>
          <p className="home-hero__description home-hero__enter">
            Bring your next sports space to life. From planning and surface selection to installation and long-term
            maintenance, we help shape every step.
          </p>
          <div className="home-hero__actions home-hero__enter">
            <ButtonLink href="/contact" className="home-button">
              Start Your Project <ArrowRight size={19} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/sports" variant="secondary" className="home-button">
              Explore Sports <MoveUpRight size={18} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        <div className="home-hero__footnote">
          <p>One space. Every possibility.</p>
          <ul aria-label="Project services">
            <li>Planning & design</li>
            <li>Construction & installation</li>
            <li>Maintenance</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
