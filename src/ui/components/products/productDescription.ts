import createDOMPurify from "dompurify";
import { hasRichText, toRichTextHtml } from "../../../../shared/richText";

const purifier = typeof window !== "undefined" ? createDOMPurify(window) : null;
purifier?.addHook("uponSanitizeAttribute", (node, data) => {
  if (data.attrName === "style") {
    const alignment = data.attrValue.match(/(?:^|;)\s*text-align\s*:\s*(left|center|right|justify)\s*(?:;|$)/i)?.[1];
    if (alignment) data.attrValue = `text-align:${alignment.toLowerCase()}`;
    else data.keepAttr = false;
  }
  if (node.nodeName === "IMG" && data.attrName === "src" && !/^(https?:\/\/|\/(?!\/))/i.test(data.attrValue)) data.keepAttr = false;
});
purifier?.addHook("afterSanitizeAttributes", node => {
  if (node.nodeName === "A") node.setAttribute("rel", "noopener noreferrer");
});
export function productDescriptionHtml(content: string): string {
  if (!purifier) return toRichTextHtml(content);
  return purifier.sanitize(hasRichText(content) ? content : toRichTextHtml(content), {
    ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "s", "h1", "h2", "h3", "h4", "ul", "ol", "li", "a", "blockquote", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "img"],
    ALLOWED_ATTR: ["href", "title", "target", "rel", "style", "colspan", "rowspan", "start", "src", "alt", "width", "height"],
    ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false
  });
}
