import { useEffect, useState } from "react";
import { adminApi } from "../services/api";
import { mediaUrl } from "../../services/apiConfig";

type Asset = { id: string; title: string; url: string; mimeType: string };
export function ImageField({ value, disabled, onChange, onBusy, label, id }: {
  label: string; id: string; value: unknown; disabled: boolean; onChange: (value: string | null) => void; onBusy: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [failed, setFailed] = useState(false);
  const url = typeof value === "string" ? value : "";
  useEffect(() => { setFailed(false); }, [url]);
  return <div className="admin-form-row">
    <label htmlFor={`${id}-url`}>{label}</label>
    <input id={`${id}-url`} className="admin-input" value={url} disabled={disabled || busy} onChange={event => onChange(event.target.value || null)} placeholder="Enter an image URL or upload below" />
    {!disabled && <><label htmlFor={`${id}-upload`}>Upload image</label><input id={`${id}-upload`} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" disabled={busy} onChange={async event => {
      const input = event.currentTarget; const file = input.files?.[0]; if (!file) return;
      setBusy(true); onBusy(true); setError("");
      try {
        const body = new FormData(); body.append("file", file); body.append("title", file.name);
        const result = await adminApi.postForm<{ item: Asset }>("/media", body);
        onChange(result.item.url);
      } catch { setError("Image upload failed. Please try again."); }
      finally { setBusy(false); onBusy(false); input.value = ""; }
    }} /><button type="button" className="admin-btn admin-btn-ghost" disabled={busy || !url} onClick={() => onChange(null)}>Remove image</button></>}
    {busy && <p role="status">Uploading image...</p>}{error && <p role="alert" className="admin-error">{error}</p>}
    {url && !failed && <img src={mediaUrl(url)} alt={`${label} preview`} onError={() => setFailed(true)} style={{ width: 240, maxWidth: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 8 }} />}
    {failed && <p role="status">Image preview unavailable. Check the URL before publishing.</p>}
  </div>;
}
