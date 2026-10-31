import { toRichTextHtml } from "../../../shared/richText";

export function RichTextContent({ content, className = "" }: { content: string; className?: string }) {
  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: toRichTextHtml(content) }} />;
}
