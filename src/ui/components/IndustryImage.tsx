import { useState } from "react";
import { Building2 } from "lucide-react";
import { mediaUrl } from "../../services/apiConfig";

export function IndustryImage({ image, name }: { image: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="industry-card-image">
    {image && !failed ? <img src={mediaUrl(image)} alt={name} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      : <span role="img" aria-label={`${name}: image unavailable`}><Building2 size={40} aria-hidden="true" /></span>}
  </div>;
}
