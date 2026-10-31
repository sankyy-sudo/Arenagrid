import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { sanitizeRichText, sanitizeStoredContent, toRichTextHtml, richTextToPlain } from "../shared/richText";
import { productCreateSchema, productUpdateSchema, industryUpdateSchema, serviceCreateSchema, faqCreateSchema } from "../shared/validation";
import { RichTextContent } from "../src/ui/components/RichTextContent";
import { cardSummary } from "../src/ui/data/cardContent";

const formatted = '<h2 style="text-align:center">Court systems</h2><p><strong>Strong</strong> <em>Italic</em> <u>Underline</u> <s>Strike</s> <a href="https://example.com">Details</a></p><ul><li><p>Grip</p></li></ul><ol><li><p>Prepare</p></li></ol><blockquote><p>Plan carefully.</p></blockquote><table><tbody><tr><th><p>Surface</p></th><td><p>Acrylic</p></td></tr></tbody></table>';
test("rich text preserves formatting through create/update validation and public rendering", () => {
  const saved = productCreateSchema.parse({ name: "Courts", slug: "courts", fullDescription: formatted }).fullDescription!;
  assert.equal(productUpdateSchema.parse({ fullDescription: saved }).fullDescription, saved);
  const rendered = renderToStaticMarkup(React.createElement(RichTextContent, { content: saved }));
  for (const tag of ['h2','strong','em','u','s','ul','ol','blockquote','table','th','td']) assert.match(rendered, new RegExp('<'+tag+'[ >]'));
  assert.match(rendered, /text-align:center/);
  assert.match(rendered, /href="https:\/\/example.com"/);
});
test("sanitization rejects scripts, unsafe URLs, event handlers and arbitrary styles", () => {
  const hostile = '<script>alert(1)</script><svg onload="alert(1)"></svg><iframe srcdoc="bad"></iframe><img src=x onerror="alert(1)"><p onclick="bad()" style="text-align:right;position:fixed;background:url(javascript:bad)">Safe</p><a href="jav&#x61;script:alert(1)">Link</a><a href="//evil.example">Other</a>';
  const clean = sanitizeRichText(hostile);
  assert.match(clean, /text-align:right/);
  assert.doesNotMatch(clean, /script|svg|iframe|img|onerror|onclick|position|background|href=/i);
  assert.equal(industryUpdateSchema.parse({ solution: hostile }).solution, clean);
  assert.equal(toRichTextHtml(hostile), clean);
});
test("plain text, line breaks, omission, null and clearing remain compatible", () => {
  const old = 'First & second\nNext line\n\n2 < 3';
  assert.equal(sanitizeStoredContent(old), old);
  assert.match(toRichTextHtml(old), /First &amp; second<br>Next line<\/p><p>2 &lt; 3/);
  assert.deepEqual(productUpdateSchema.parse({}), {});
  assert.equal(productUpdateSchema.parse({ fullDescription: null }).fullDescription, null);
  assert.equal(productUpdateSchema.parse({ fullDescription: "" }).fullDescription, "");
});
test("summaries strip tags and decode entities; limits count visible text", () => {
  assert.equal(richTextToPlain('<p>Turf &amp; courts.</p>'), 'Turf & courts.');
  assert.equal(cardSummary({ description: '<p><strong>Built for training.</strong></p>' }), 'Built for training.');
  assert(serviceCreateSchema.safeParse({ name: "Build", slug: "build", shortDescription: '<strong>'+ 'a'.repeat(300) +'</strong>' }).success);
  assert(!serviceCreateSchema.safeParse({ name: "Build", slug: "build", shortDescription: '<p>'+ 'a'.repeat(301) +'</p>' }).success);
  assert(!faqCreateSchema.safeParse({ question: "Question?", answer: '<p><br></p>' }).success);
});
