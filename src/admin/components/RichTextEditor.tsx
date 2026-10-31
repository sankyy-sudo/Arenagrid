import { useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Unlink, Table, Quote, Undo2, Redo2, RemoveFormatting } from "lucide-react";
import { sanitizeRichText, toRichTextHtml } from "../../../shared/richText";
import "../../ui/styles/rich-text.css";
import "./rich-text-editor.css";

export function RichTextEditor({ id, label, value, onChange, disabled = false, required = false }: {
  id: string; label: string; value: string; onChange: (html: string) => void; disabled?: boolean; required?: boolean;
}) {
  const emitted = useRef(value);
  const [panel, setPanel] = useState<"link" | "table" | null>(null);
  const [url, setUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3, 4] }, code: false, codeBlock: false, horizontalRule: false, link: { openOnClick: false, autolink: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } } }), TextAlign.configure({ types: ["heading", "paragraph"] }), TableKit],
    content: toRichTextHtml(value),
    editable: !disabled,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { id, class: "rich-text admin-editor-content", role: "textbox", "aria-label": label, "aria-multiline": "true", "aria-required": String(required) }, transformPastedHTML: sanitizeRichText },
    onUpdate: ({ editor: current }) => {
      const html = current.isEmpty ? "" : sanitizeRichText(current.getHTML());
      emitted.current = html;
      onChange(html);
    }
  });
  useEffect(() => { editor?.setEditable(!disabled, false); }, [editor, disabled]);
  useEffect(() => {
    if (editor && value !== emitted.current) {
      const html = toRichTextHtml(value);
      if (html !== sanitizeRichText(editor.getHTML())) editor.commands.setContent(html, { emitUpdate: false });
      emitted.current = value;
    }
  }, [editor, value]);
  if (!editor) return <div role="status">Loading editor...</div>;
  const button = (title: string, icon: ReactNode, run: () => void, active?: boolean, unavailable = false) => <button key={title} type="button" title={title} aria-label={title} aria-pressed={active} disabled={disabled || unavailable} onMouseDown={event => event.preventDefault()} onClick={run}>{icon}</button>;
  const closePanel = () => { setPanel(null); editor.commands.focus(); };
  function applyLink() {
    const href = url.trim();
    if (!/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href) || Array.from(href).some(char => char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127)) { setLinkError("Enter an https://, http://, mailto:, tel:, /path or #anchor link."); return; }
    if (editor!.state.selection.empty && !editor!.isActive("link")) {
      editor!.chain().focus().insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
    } else editor!.chain().focus().extendMarkRange("link").setLink({ href }).run();
    closePanel();
  }
  return <div className="admin-editor" data-disabled={disabled}>
    <div className="admin-editor-toolbar" role="group" aria-label={`${label} formatting`}>
      <select aria-label="Paragraph style" disabled={disabled} value={editor.isActive("heading") ? String(editor.getAttributes("heading").level) : "paragraph"} onChange={event => {
        if (event.target.value === "paragraph") editor.chain().focus().setParagraph().run();
        else editor.chain().focus().setHeading({ level: Number(event.target.value) as 1 | 2 | 3 | 4 }).run();
      }}><option value="paragraph">Paragraph</option>{[1,2,3,4].map(level => <option key={level} value={level}>Heading {level}</option>)}</select>
      {button("Bold", <Bold size={18} />, () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
      {button("Italic", <Italic size={18} />, () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
      {button("Underline", <Underline size={18} />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline"))}
      {button("Strikethrough", <Strikethrough size={18} />, () => editor.chain().focus().toggleStrike().run(), editor.isActive("strike"))}
      {button("Bullet list", <List size={18} />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
      {button("Numbered list", <ListOrdered size={18} />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
      {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight], ['justify', AlignJustify]] as const).map(([alignment, Icon]) => button(`Align ${alignment}`, <Icon size={18} />, () => editor.chain().focus().setTextAlign(alignment).run(), editor.isActive({ textAlign: alignment })))}
      {button("Insert or edit link", <LinkIcon size={18} />, () => { setUrl(editor.getAttributes("link").href || ""); setLinkError(""); setPanel("link"); }, editor.isActive("link"))}
      {button("Remove link", <Unlink size={18} />, () => editor.chain().focus().extendMarkRange("link").unsetLink().run(), undefined, !editor.isActive("link"))}
      {button("Insert table", <Table size={18} />, () => setPanel("table"), undefined, editor.isActive("table"))}
      {button("Blockquote", <Quote size={18} />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
      {button("Undo", <Undo2 size={18} />, () => editor.chain().focus().undo().run(), undefined, !editor.can().undo())}
      {button("Redo", <Redo2 size={18} />, () => editor.chain().focus().redo().run(), undefined, !editor.can().redo())}
      {button("Clear formatting", <RemoveFormatting size={18} />, () => editor.chain().focus().unsetAllMarks().clearNodes().unsetTextAlign().run())}
    </div>
    {editor.isActive("table") && <div className="admin-editor-table-tools" role="group" aria-label="Edit table">
      {[['Row before', () => editor.chain().focus().addRowBefore().run()], ['Row after', () => editor.chain().focus().addRowAfter().run()], ['Delete row', () => editor.chain().focus().deleteRow().run()], ['Column before', () => editor.chain().focus().addColumnBefore().run()], ['Column after', () => editor.chain().focus().addColumnAfter().run()], ['Delete column', () => editor.chain().focus().deleteColumn().run()], ['Toggle header row', () => editor.chain().focus().toggleHeaderRow().run()], ['Delete table', () => editor.chain().focus().deleteTable().run()]].map(([title, run]) => <button key={String(title)} type="button" disabled={disabled} onMouseDown={event => event.preventDefault()} onClick={run as () => void}>{String(title)}</button>)}
    </div>}
    {panel && !disabled && <div className="admin-editor-panel" onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); closePanel(); } }}>
      {panel === "link" ? <><label htmlFor={`${id}-url`}>Link URL</label><input autoFocus id={`${id}-url`} value={url} onChange={event => setUrl(event.target.value)} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); applyLink(); } }} placeholder="https://example.com" /><button type="button" onClick={applyLink}>Apply link</button>{linkError && <span role="alert">{linkError}</span>}</>
        : <><label>Rows <select value={rows} onChange={event => setRows(Number(event.target.value))}>{Array.from({length: 10}, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label><label>Columns <select value={columns} onChange={event => setColumns(Number(event.target.value))}>{Array.from({length: 8}, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label><button type="button" onClick={() => { editor.chain().focus().insertTable({ rows, cols: columns, withHeaderRow: true }).run(); closePanel(); }}>Insert</button></>}
      <button type="button" onClick={closePanel}>Cancel</button>
    </div>}
    <EditorContent editor={editor} />
    <div className="admin-editor-help">Select text to format. Tables scroll horizontally on small screens.</div>
  </div>;
}
