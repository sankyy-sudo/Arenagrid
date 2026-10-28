import { ArrowRight } from "lucide-react";
import { ButtonLink } from "../ButtonLink";
import { FAQAccordion } from "../FAQAccordion";
import { SectionHeader } from "../SectionHeader";

// Answers reflect existing product, service and enquiry content; no price or delivery promises.
const projectQuestions = [
  { question: "What should I share about my project?", answer: "Tell us your site location, facility type, sports, expected timeline and goals. These details help shape the first project conversation." },
  { question: "Can you manage civil work and surface installation?", answer: "Yes. The delivery model is structured around consultation, design, base construction, installation and maintenance." },
  { question: "Which surface systems can we explore?", answer: "The product range includes synthetic sports turf, acrylic court systems, indoor sports flooring and running track surfaces. The right system depends on the sport and how the facility will be used." },
  { question: "What happens after installation?", answer: "Maintenance services cover lifecycle care, cleaning, repairs and long-term surface performance planning." }
];

export function HomeEnquiry() {
  return (
    <>
      <section className="home-section home-faq" id="project-questions">
        <div className="home-container home-faq-grid">
          <div data-reveal><SectionHeader eyebrow="Before we get started" title="Big plans start with a few questions."
            copy="A little clarity before you take the next step." /><a className="home-text-link" href="/contact">Talk about your project <ArrowRight size={18} aria-hidden="true" /></a></div>
          <FAQAccordion items={projectQuestions} />
        </div>
      </section>
      <section className="home-section home-enquiry" aria-labelledby="home-enquiry-title">
        <div className="home-container" data-reveal>
          <span className="home-label">Your next sports space</span>
          <h2 id="home-enquiry-title">Make room for<br />the next great game.</h2>
          <div className="home-enquiry-bottom"><p>Share your site, sport mix and vision.<br />Let’s bring your next facility to life.</p><ButtonLink href="/contact" className="home-button">Start Your Project <ArrowRight size={20} aria-hidden="true" /></ButtonLink></div>
        </div>
      </section>
    </>
  );
}
