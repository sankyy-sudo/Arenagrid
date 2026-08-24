import { useState } from "react";
import { ButtonLink } from "../components/ButtonLink";
import { SectionHeader } from "../components/SectionHeader";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <section className="inner-hero contact-hero">
        <div>
          <span className="eyebrow">Project enquiry</span>
          <h1>Start a sports infrastructure conversation</h1>
          <p>Share the site, sport mix, timeline and budget range. The next step should feel clear.</p>
        </div>
      </section>
      <section className="page-shell contact-layout">
        <div>
          <SectionHeader
            eyebrow="Enquiry"
            title="Tell us what you want to build"
            copy="The form is wired to the persistent lead endpoint when the API and database are available."
          />
          <div className="contact-aside">
            <strong>Prefer a faster first touch?</strong>
            <p>Send a WhatsApp message with location, sport and approximate area.</p>
            <ButtonLink href="https://wa.me/?text=Hello%20Arena%20Grid%20Infra%2C%20I%20want%20to%20discuss%20a%20project." variant="outline">
              WhatsApp enquiry
            </ButtonLink>
          </div>
        </div>
        {submitted ? (
          <div className="success-state">Thanks. Your enquiry has been captured for the sales team.</div>
        ) : (
          <form
            className="contact-form"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setIsSubmitting(true);
              const form = new FormData(event.currentTarget);

              try {
                const response = await fetch("/api/leads", {
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
            <div className="form-grid">
              <label>
                First name
                <input name="firstName" autoComplete="given-name" required minLength={2} />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" />
              </label>
              <label>
                Mobile
                <input name="mobile" type="tel" autoComplete="tel" />
              </label>
              <label>
                Company
                <input name="company" autoComplete="organization" />
              </label>
              <label>
                City
                <input name="city" autoComplete="address-level2" />
              </label>
              <label>
                Project type
                <select name="projectType">
                  <option value="">Select</option>
                  <option>School campus</option>
                  <option>Sports academy</option>
                  <option>Residential amenity</option>
                  <option>Club facility</option>
                </select>
              </label>
              <label>
                Timeline
                <select name="timeline">
                  <option value="">Select</option>
                  <option>Immediate</option>
                  <option>1-3 months</option>
                  <option>3-6 months</option>
                  <option>Planning stage</option>
                </select>
              </label>
            </div>
            <label>
              Project requirement
              <textarea name="message" rows={5} placeholder="Sport mix, approximate area, location, timeline or constraints" />
            </label>
            {error ? <div className="form-error">{error}</div> : null}
            <button className="primary-action" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
