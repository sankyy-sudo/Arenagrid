import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Can Arena Grid Infra manage both civil work and surface installation?",
    answer: "Yes. The delivery model is structured around consultation, design, base construction, installation and maintenance."
  },
  {
    question: "Are products connected to sports and project references?",
    answer: "The platform foundation supports CMS relationships between products, sports, services, projects and FAQs."
  },
  {
    question: "Can the website support landing pages for campaigns?",
    answer: "Yes. The route and CMS architecture is ready for dynamic landing pages in the SEO and CMS phases."
  }
];

type FAQItem = { question: string; answer: string };

export function FAQAccordion({ items = faqs }: { items?: readonly FAQItem[] }) {
  return (
    <div className="faq-list">
      {items.map((faq) => (
        <details key={faq.question} className="faq-item">
          <summary>
            {faq.question}
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
