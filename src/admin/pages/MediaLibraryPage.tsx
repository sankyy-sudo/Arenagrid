import { useEffect, useRef, useState } from "react";
import { adminApi, ApiClientError } from "../api";
import { useAuth } from "../AuthContext";

interface MediaAsset {
  id: string;
  title: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

const MEDIA_WRITE_ROLES = ["SUPER_ADMIN", "CONTENT_MANAGER", "EDITOR", "PROJECT_MANAGER"];
const MEDIA_DELETE_ROLES = ["SUPER_ADMIN", "CONTENT_MANAGER"];

export function MediaLibraryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canWrite = user ? MEDIA_WRITE_ROLES.includes(user.role) : false;
  const canDelete = user ? MEDIA_DELETE_ROLES.includes(user.role) : false;

  function load() {
    setLoading(true);
    adminApi
      .get<{ items: MediaAsset[] }>("/media")
      .then((res) => setItems(res.items))
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Failed to load media."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);
        await adminApi.postForm("/media", formData);
      }
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this file? This cannot be undone.")) return;
    try {
      await adminApi.delete(`/media/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Delete failed.");
    }
  }

  return (
    <div>
      <h2 className="admin-h2">Media Library</h2>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-card">
        {canWrite && (
          <div style={{ marginBottom: 16 }}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,application/pdf"
              disabled={uploading}
              onChange={(e) => handleUpload(e.target.files)}
            />
            {uploading && <span style={{ marginLeft: 10, fontSize: 13, color: "#666" }}>Uploading&hellip;</span>}
          </div>
        )}

        {loading ? (
          <div className="admin-empty">Loading&hellip;</div>
        ) : items.length === 0 ? (
          <div className="admin-empty">No media uploaded yet.</div>
        ) : (
          <div className="admin-media-grid">
            {items.map((item) => (
              <div className="admin-media-item" key={item.id}>
                {item.mimeType.startsWith("image/") ? (
                  <img src={item.url} alt={item.title} />
                ) : (
                  <div
                    style={{
                      height: 110,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f0f0f0",
                      fontSize: 12,
                      color: "#888"
                    }}
                  >
                    {item.mimeType}
                  </div>
                )}
                <div className="meta">
                  <div className="name">{item.title}</div>
                  <div>{(item.sizeBytes / 1024).toFixed(0)} KB</div>
                  {canDelete && (
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ marginTop: 6, padding: "3px 8px", fontSize: 11 }}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}