import { useSearchParams } from "react-router-dom";
import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Ruler } from "lucide-react";
import "../styles/contact.css";
import { ButtonLink } from "../components/ButtonLink";
import { PUBLIC_API_BASE } from "../../services/apiConfig";

export function ContactPage() {
  const [params] = useSearchParams();
  const subject = (params.get("subject") || "").slice(0, 160);
  const submissionPending = useRef(false);
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
          <div className="contact-whatsapp"><MessageCircle size={25} aria-hidden="true" /><h2>Prefer WhatsApp?</h2><p>Start a conversation with your location, sport and approximate area.</p><ButtonLink href="https://wa.me/919716964745?text=Hello%20Arena%20Grid%20Infra%2C%20I%20want%20to%20discuss%20a%20project." variant="outline">Chat on WhatsApp <ArrowRight size={17} aria-hidden="true" /></ButtonLink></div>
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
              if (submissionPending.current) return;
              submissionPending.current = true;
              setError(null);
              setIsSubmitting(true);
              const form = new FormData(event.currentTarget);
              const field = (name: string) => String(form.get(name) ?? "").trim() || undefined;

              try {
                const response = await fetch(`${PUBLIC_API_BASE}/leads`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "Contact Us",
                    firstName: field("firstName"),
                    email: field("email"),
                    mobile: field("mobile"),
                    company: field("company"),
                    city: field("city"),
                    message: field("message"),
                    interest: { subject: field("subject") },
                    project: {
                      projectType: field("projectType"),
                      timeline: field("timeline")
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
                submissionPending.current = false;
                setIsSubmitting(false);
              }
            }}
          >
            <div className="contact-form-heading"><span className="home-label">Project enquiry</span><h2 id="enquiry-form-title">Tell us what you want to build.</h2></div>
            {subject && <label>Subject<input key={subject} name="subject" defaultValue={subject} maxLength={160} /></label>}
            <div className="form-grid">
              <label>
                Your Name :
                <input name="firstName" autoComplete="given-name" required minLength={2} maxLength={80} />
              </label>
              <label>
                Email :
                <input name="email" type="email" autoComplete="email" />
              </label>
              <label>
                Mobile :
                <input name="mobile" type="tel" autoComplete="tel" maxLength={30} />
              </label>
              <label>
                City :
                <input name="city" autoComplete="address-level2" maxLength={80} />
              </label>
              
           
            </div>
            <label>
              Message :
              <textarea name="message" rows={5} maxLength={2000} placeholder="write here..." />
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
