import { ArrowRight, MapPin, Quote } from "lucide-react";
import { projects, testimonials } from "../../content";
import { SectionHeader } from "../SectionHeader";

export function HomeProjects() {
  return (
    <section className="home-section home-projects" id="selected-projects">
      <div className="home-container">
        <div className="home-section-top" data-reveal>
          <SectionHeader eyebrow="Selected projects" title="Different spaces. A shared love of sport."
            copy="Explore the campus, academy and community projects in our portfolio." />
          <a className="home-text-link" href="/projects">Explore projects <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="home-project-list" data-reveal-group>
          {projects.map((project, index) => (
            <article key={project.title} data-reveal>
              <span className="home-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><span className="home-label">{project.type}</span><h3>{project.title}</h3><p className="home-project-location"><MapPin size={15} aria-hidden="true" />{project.location}</p></div>
              <div className="home-project-meta"><p>{project.sport}</p><span>{project.status}</span></div>
            </article>
          ))}
        </div>
        <div className="home-testimonials" role="group" aria-label="Client testimonials" data-reveal-group>
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} data-reveal>
              <Quote size={28} strokeWidth={1.5} aria-hidden="true" />
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption><strong>{testimonial.name}</strong><span>{testimonial.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
