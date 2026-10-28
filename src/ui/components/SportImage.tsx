import { useState } from "react";
import { Trophy } from "lucide-react";
import { mediaUrl } from "../../services/apiConfig";

export function SportImage({ image, name }: { image: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  return <div style={{ aspectRatio: "4 / 3", overflow: "hidden", width: "100%", borderRadius: "inherit" }}>
    {image && !failed ? <img src={mediaUrl(image)} alt={`${name} sports surface`} loading="lazy" decoding="async" onError={() => setFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      : <div role="img" aria-label={`${name}: image unavailable`} style={{ display: "grid", placeItems: "center", height: "100%", background: "var(--green-800)", color: "white" }}><Trophy size={40} aria-hidden="true" /></div>}
  </div>;
}
