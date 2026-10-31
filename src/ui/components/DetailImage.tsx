import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { mediaUrl } from "../../services/apiConfig";

export function DetailImage({ url, alt }: { url?: string; alt: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "error">(url ? "loading" : "error");
  return <div className="detail-image" aria-busy={state === "loading"}>
    {state === "loading" && <span className="detail-image-skeleton" aria-hidden="true" />}
    {state === "error" ? <span className="detail-image-fallback" role="img" aria-label={`${alt}: image unavailable`}><ImageIcon size={36} aria-hidden="true" /><span>Image coming soon</span></span>
      : <img src={mediaUrl(url!)} alt={alt} width={960} height={540} loading="lazy" decoding="async" onLoad={() => setState("loaded")} onError={() => setState("error")} />}
  </div>;
}
