import sanitizeHtml from "sanitize-html";
import { decodeHTML } from "entities";

const tags = ["p", "br", "strong", "b", "em", "i", "u", "s", "strike", "h1", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "table", "thead", "tbody", "tfoot", "tr", "th", "td"];
export const hasRichText = (value: string) => /<\/?[a-z][^>]*>/i.test(value);
export function sanitizeRichText(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: tags,
    allowedAttributes: { a: ["href", "title", "target", "rel"], p: ["style"], h1: ["style"], h2: ["style"], h3: ["style"], h4: ["style"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"], ol: ["start"] },
    allowedStyles: { "*": { "text-align": [/^(left|center|right|justify)$/] } },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: { a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, rel: "noopener noreferrer", ...(attribs.target === "_blank" ? { target: "_blank" } : { target: "_self" }) } }) }
  });
}
export function richTextToPlain(value: string | null | undefined): string {
  if (!value) return "";
  if (!hasRichText(value)) return value;
  const html = sanitizeRichText(value).replace(/<br\s*\/?>|<\/(?:p|h[1-4]|li|blockquote|tr|td|th)>/gi, " ");
  return decodeHTML(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })).replace(/\s+/g, " ").trim();
}
// Keep legacy plain text unchanged in storage. Escape it before passing it to HTML consumers.
export const sanitizeStoredContent = (value: string) => hasRichText(value) ? sanitizeRichText(value) : value;
export function toRichTextHtml(value: string): string {
  if (hasRichText(value)) return sanitizeRichText(value);
  const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return escaped ? escaped.split(/\r?\n\s*\r?\n/).map(paragraph => `<p>${paragraph.replace(/\r?\n/g, "<br>")}</p>`).join("") : "";
}
