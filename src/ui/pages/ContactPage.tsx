import { useState } from "react";
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Ruler } from "lucide-react";
import "../styles/contact.css";
import { ButtonLink } from "../components/ButtonLink";
import { PUBLIC_API_BASE } from "../../services/apiConfig";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="contact-page home-design">
     
      <section className="contact-workspace contact-container" aria-label="Project enquiry">
        <aside className="contact-guidance">
          <div className="contact-guide-card"><span className="home-label">A little preparation helps</span><h2>Bring your ideas.{" "}<br />We'll help shape the plan.</h2><p>You don't need every detail figured out. Start with what you know.</p><ul>
            <li><MapPin size={21} aria-hidden="true" /><div><strong>Your location</strong><span>City, facility type and site details.</span></div></li>
            <li><Ruler size={21} aria-hidden="true" /><div><strong>Your space</strong><span>Approximate area and the sports you have in mind.</span></div></li>
            <li><MessageCircle size={21} aria-hidden="true" /><div><strong>Your priorities</strong><span>Timeline, budget range and any site constraints.</span></div></li>
          </ul></div>
          <div className="contact-whatsapp"><MessageCircle size={25} aria-hidden="true" /><h2>Prefer WhatsApp?</h2><p>Start a conversation with your location, sport and approximate area.</p><ButtonLink href="https://wa.me/?text=Hello%20Arena%20Grid%20Infra%2C%20I%20want%20to%20discuss%20a%20project." variant="outline">Chat on WhatsApp <ArrowRight size={17} aria-hidden="true" /></ButtonLink></div>
        </aside>
        {submitted ? (
          <div className="success-state" role="status"><CheckCircle2 size={40} aria-hidden="true" /><h2>Thank you for getting in touch.</h2><p>Your enquiry has been captured for the sales team.</p><ButtonLink href="/products" variant="outline">Explore Surface Systems <ArrowRight size={17} aria-hidden="true" /></ButtonLink></div>
        ) : (
          <form
            className="contact-form"
            aria-labelledby="enquiry-form-title"
            aria-busy={isSubmitting}
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setIsSubmitting(true);
              const form = new FormData(event.currentTarget);

              try {
                const response = await fetch(`${PUBLIC_API_BASE}/leads`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "Contact Us",
                    firstName: form.get("firstName"),
                    email: form.get("email") || undefined,
                    mobile: form.get("mobile") || undefined,
                    company: form.get("company") || undefined,
                    city: form.get("city") || undefined,
                    message: form.get("message") || undefined,
                    project: {
                      projectType: form.get("projectType") || undefined,
                      timeline: form.get("timeline") || undefined
                    },
                    attribution: {
                      landingPage: window.location.pathname,
                      referrer: document.referrer || undefined
                    }
                  })
                });

                if (!response.ok) {
                  throw new Error("Unable to submit enquiry");
                }

                setSubmitted(true);
              } catch {
                setError("We could not submit the enquiry. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <div className="contact-form-heading"><span className="home-label">Project enquiry</span><h2 id="enquiry-form-title">Tell us what you want to build.</h2></div>
            <div className="form-grid">
              <label>
                Your Name :
                <input name="firstName" autoComplete="given-name" required minLength={2} />
              </label>
              <label>
                Email :
                <input name="email" type="email" autoComplete="email" />
              </label>
              <label>
                Mobile :
                <input name="mobile" type="tel" autoComplete="tel" />
              </label>
              <label>
                City :
                <input name="city" autoComplete="address-level2" />
              </label>
              
           
            </div>
            <label>
              Message :
              <textarea name="message" rows={5} placeholder="write here..." />
            </label>
            {error ? <div className="form-error" role="alert">{error}</div> : null}
            <button className="primary-action" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
