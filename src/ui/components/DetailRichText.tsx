import { useMemo } from "react";
import { productDescriptionHtml } from "./products/productDescription";

export function DetailRichText({ content, className = "" }: { content: string; className?: string }) {
  const html = useMemo(() => {
    const sanitized = productDescriptionHtml(content);
    if (typeof DOMParser === "undefined") return sanitized;
    const document = new DOMParser().parseFromString(sanitized, "text/html");
    document.querySelectorAll("table").forEach(table => {
      const wrapper = document.createElement("div");
      wrapper.className = "detail-table-scroll";
      wrapper.tabIndex = 0;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Content table");
      table.before(wrapper);
      wrapper.append(table);
    });
    return document.body.innerHTML;
  }, [content]);
  return <div className={`prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function DetailSpecifications({ specs }: { specs: { name: string; value: string }[] }) {
  const rows = specs.filter(spec => spec.value.trim());
  if (!rows.length) return null;
  return <section className="detail-content-specifications" aria-labelledby="detail-specifications-title">
    <h2 id="detail-specifications-title">Details and specifications</h2>
    <div className="detail-table-scroll" role="region" aria-label="Details and specifications table" tabIndex={0}>
      <table><tbody>{rows.map((spec, index) => <tr key={`${spec.name}-${index}`}><th scope="row">{spec.name}</th><td>{spec.value}</td></tr>)}</tbody></table>
    </div>
  </section>;
}
