import { RichTextEditor } from "../components/RichTextEditor";
import { richTextToPlain } from "../../../shared/richText";
import { ImageField } from "../components/ImageField";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { adminApi, ApiClientError } from "../services/api";
import { getResourceDef, type FieldDef } from "../resourceConfig";
import { useAuth } from "../hooks/useAuth";

type FormValues = Record<string, unknown>;

interface OptionItem {
  id: string;
  label: string;
}

function optionLabel(item: Record<string, unknown>): string {
  return String(item.name ?? item.title ?? item.question ?? item.label ?? item.id);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface Specification {
  name: string;
  value: string;
  unit?: string;
}

export function ResourceFormPage() {
  const { resourceKey, id } = useParams();
  return <ResourceForm key={`${resourceKey}/${id}`} />;
}

function ResourceForm() {
  const { resourceKey, id } = useParams<{ resourceKey: string; id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const def = resourceKey ? getResourceDef(resourceKey) : undefined;
  const isNew = id === "new";

  const [values, setValues] = useState<FormValues>({});
  const [options, setOptions] = useState<Record<string, OptionItem[]>>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [busyImages, setBusyImages] = useState<Record<string, boolean>>({});
  const mediaBusy = Object.values(busyImages).some(Boolean);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const relationFields = useMemo(
    () => (def ? def.fields.filter((f) => f.type === "select" || f.type === "multiselect") : []),
    [def]
  );

  // Load relation dropdown/checkbox options.
  useEffect(() => {
    relationFields.forEach((field) => {
      if (!field.optionsResource || options[field.optionsResource]) return;
      adminApi
        .get<{ items: Record<string, unknown>[] }>(`/${field.optionsResource}`)
        .then((res) => {
          setOptions((prev) => ({
            ...prev,
            [field.optionsResource!]: res.items.map((i) => ({ id: String(i.id), label: optionLabel(i) }))
          }));
        })
        .catch(() => {
          /* Non-fatal: the field just renders with no options. */
        });
    });
  }, [relationFields, options]);

  // Load existing record when editing.
  useEffect(() => {
    if (!def || isNew) return;
    setLoading(true);
    adminApi
      .get<{ item: Record<string, unknown> }>(`/${def.key}/${id}`)
      .then((res) => {
        const item = res.item;
        const initial: FormValues = { ...item };
        if (def.key === "projects") initial.progress = item.progress === 100 ? 100 : 0;
        // Flatten relation objects back to id arrays/ids for the form.
        for (const field of def.fields) {
          if (field.type === "multiselect") {
            const raw = item[field.key.replace(/Ids$/, "s")] ?? item[field.key];
            if (Array.isArray(raw)) {
              initial[field.key] = raw.map((r: unknown) =>
                typeof r === "string" ? r : String((r as Record<string, unknown>).id)
              );
            }
          } else if (field.type === "select" && field.key.endsWith("Id")) {
            const relKey = field.key.replace(/Id$/, "");
            const rel = item[relKey] as Record<string, unknown> | null | undefined;
            if (rel && typeof rel === "object") initial[field.key] = rel.id;
          } else if (field.type === "specifications") {
            initial.specifications = Array.isArray(item.specifications) ? item.specifications : [];
          }
        }
        setValues(initial);
      })
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Failed to load record."))
      .finally(() => setLoading(false));
  }, [def, id, isNew]);

  if (!def) return <Navigate to="/admin" replace />;
  const canWrite = user ? def.roles.write.includes(user.role) : false;

  function setField(key: string, value: unknown) {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key === def!.fields.find((f) => f.type === "text" && f.key !== "slug")?.key && !slugTouched) {
      const slugField = def!.fields.find((f) => f.type === "slug");
      if (slugField && typeof value === "string") {
        setValues((prev) => ({ ...prev, [slugField.key]: slugify(value) }));
      }
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!def || mediaBusy || saving) return;
    const missingContent = def.fields.find(field => field.type === "textarea" && field.required && !richTextToPlain(String(values[field.key] ?? "")).trim());
    if (missingContent) {
      setError(`${missingContent.label} is required.`);
      document.getElementById(`field-${missingContent.key}`)?.focus();
      return;
    }
    setSaved(false);
    setSaving(true);
    setError(null);
    try {
      // Omit hidden content settings so editing the visible form cannot overwrite them.
      const payload = ["products", "sports", "projects", "industries"].includes(def.key)
        ? Object.fromEntries(def.fields.filter(field => field.key in values).map(field => [field.key, values[field.key]]))
        : { ...values };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;

      if (isNew) {
        const res = await adminApi.post<{ item: { id: string } }>(`/${def.key}`, payload);
        navigate(`/admin/${def.key}/${res.item.id}`, { replace: true });
      } else {
        await adminApi.put(`/${def.key}/${id}`, payload);
        setSaved(true);
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? formatValidationError(err) : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-empty">Loading&hellip;</div>;

  const productFields = ["mainImageUrl", "name", "categoryId", "fullDescription", "features", "bestFor", "slug", "status"];
  const mainFields = def.key === "products"
    ? productFields.flatMap(key => def.fields.filter(field => field.key === key))
    : def.fields;
  const renderField = (field: FieldDef) => (
          <FieldInput
            key={field.key}
            onMediaBusy={busy => setBusyImages(current => ({ ...current, [field.key]: busy }))}
            field={field}
            value={values[field.key]}
            options={field.optionsResource ? options[field.optionsResource] : undefined}
            onChange={(v) => setField(field.key, v)}
            onSlugManualEdit={field.type === "slug" ? () => setSlugTouched(true) : undefined}
            disabled={!canWrite || saving}
          />
  );

  return (
    <div>
      <h2 className="admin-h2">
        {isNew ? `New ${def.singularLabel}` : `Edit ${def.singularLabel}`}
      </h2>
      {error && <div className="admin-error" role="alert">{error}</div>}
      {saved && <p role="status">Changes saved.</p>}
      {def.key === "products" && <p>Publish to show this product on the website. Draft and archived products stay hidden. Product categories have their own publish status.</p>}
      <form className="admin-card" onSubmit={handleSubmit}>
        {mainFields.map(renderField)}
        {canWrite && (
          <button className="admin-btn admin-btn-primary" type="submit" disabled={saving || mediaBusy}>
            {saving ? "Saving\u2026" : "Save"}
          </button>
        )}
      </form>
    </div>
  );
}

function formatValidationError(err: ApiClientError): string {
  if (Array.isArray(err.details)) {
    const first = err.details[0] as { path?: string; message?: string } | undefined;
    if (first?.message) return `${first.path ? `${first.path}: ` : ""}${first.message}`;
  }
  return err.message;
}

function FieldInput({
  field,
  value,
  options,
  onChange,
  onSlugManualEdit,
  disabled,
  onMediaBusy
}: {
  field: FieldDef;
  value: unknown;
  options?: OptionItem[];
  onChange: (value: unknown) => void;
  onSlugManualEdit?: () => void;
  disabled: boolean;
  onMediaBusy: (busy: boolean) => void;
}) {
  const id = `field-${field.key}`;

  if (field.type === "image") return <ImageField id={id} label={field.label} value={value} disabled={disabled} onChange={onChange} onBusy={onMediaBusy} />;

  if (field.type === "text-list") {
    const items = Array.isArray(value) ? value as string[] : [];
    const limit = field.key === "features" ? 20 : 30;
    const maxLength = field.key === "features" ? 400 : 160;
    return <fieldset className="admin-form-row" style={{ border: 0, padding: 0, minWidth: 0 }}>
      <legend>{field.label}</legend>
      <p className="help">{field.help}</p>
      {items.map((item, index) => <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input className="admin-input" aria-label={`${field.label} ${index + 1}`} value={item} required maxLength={maxLength} disabled={disabled}
          onChange={event => onChange(items.map((current, position) => position === index ? event.target.value : current))} />
        {!disabled && <button type="button" className="admin-btn admin-btn-ghost" aria-label={`Remove ${field.label} ${index + 1}`} onClick={() => onChange(items.filter((_, position) => position !== index))}>Remove</button>}
      </div>)}
      {!disabled && <button type="button" className="admin-btn admin-btn-ghost" disabled={items.length >= limit} onClick={() => onChange([...items, ""])}>+ Add {field.key === "features" ? "feature" : "use"}</button>}
    </fieldset>;
  }

  if (field.type === "boolean") {
    return (
      <div className="admin-form-row">
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          {field.label}
        </label>
      </div>
    );
  }

  if (field.type === "status") {
    return (
      <div className="admin-form-row">
        <label htmlFor={id}>{field.label}</label>
        <select
          id={id}
          className="admin-select"
          value={String(value ?? "DRAFT")}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="admin-form-row">
        <label htmlFor={id}>{field.label}</label>
        <select
          id={id}
          className="admin-select"
          value={typeof value === "string" ? value : ""}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value || null)}
        >
          <option value="">&mdash; None &mdash;</option>
          {(options ?? []).map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="admin-form-row">
        <label>{field.label}</label>
        <div className="admin-checkbox-grid">
          {(options ?? []).length === 0 && <span className="help">No options available.</span>}
          {(options ?? []).map((opt) => (
            <label key={opt.id}>
              <input
                type="checkbox"
                disabled={disabled}
                checked={selected.includes(opt.id)}
                onChange={(e) => {
                  onChange(e.target.checked ? [...selected, opt.id] : selected.filter((s) => s !== opt.id));
                }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "project-progress") {
    return <div className="admin-form-row">
      <label htmlFor={id}>{field.label}</label>
      <select id={id} className="admin-select" value={value === 100 ? 100 : 0} disabled={disabled} onChange={event => onChange(Number(event.target.value))}>
        <option value={0}>Ongoing</option>
        <option value={100}>Completed</option>
      </select>
    </div>;
  }

  if (field.type === "number") {
    return (
      <div className="admin-form-row">
        <label htmlFor={id}>{field.label}</label>
        <input
          id={id}
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
          className="admin-input"
          disabled={disabled}
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="admin-form-row">
        <label htmlFor={id}>{field.label}</label>
        <RichTextEditor id={id} label={field.label} value={typeof value === "string" ? value : ""} onChange={onChange} disabled={disabled} required={field.required} />
      </div>
    );
  }

  if (field.type === "specifications") {
    const specs = Array.isArray(value) ? (value as Specification[]) : [];
    return (
      <div className="admin-form-row">
        <label>{field.label}</label>
        {specs.map((spec, index) => (
          <div key={index} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input
              className="admin-input"
              placeholder="Name"
              disabled={disabled}
              value={spec.name}
              onChange={(e) => {
                const next = [...specs];
                next[index] = { ...next[index], name: e.target.value };
                onChange(next);
              }}
            />
            <input
              className="admin-input"
              placeholder="Value"
              disabled={disabled}
              value={spec.value}
              onChange={(e) => {
                const next = [...specs];
                next[index] = { ...next[index], value: e.target.value };
                onChange(next);
              }}
            />
            {!disabled && (
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => onChange(specs.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {!disabled && (
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={() => onChange([...specs, { name: "", value: "" }])}
          >
            + Add specification
          </button>
        )}
      </div>
    );
  }

  // text / slug
  return (
    <div className="admin-form-row">
      <label htmlFor={id}>{field.label}</label>
      <input
        id={id}
        className="admin-input"
        required={field.required}
        disabled={disabled}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => {
          if (field.type === "slug") onSlugManualEdit?.();
          onChange(field.type === "slug" ? slugify(e.target.value) : e.target.value);
        }}
      />
      {field.help && <div className="help">{field.help}</div>}
    </div>
  );
}
