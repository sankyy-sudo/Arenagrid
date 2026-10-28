/** Display the supplied emblem; keep the original artwork intact on disk. */
export function BrandMark() {
  return <span className="brand-mark brand-mark--image" aria-hidden="true">
    <svg viewBox="250 20 790 690" focusable="false" aria-hidden="true">
      <image href="/images/brand/arena-grid-logo.jpeg" width="1254" height="1254" />
    </svg>
  </span>;
}
