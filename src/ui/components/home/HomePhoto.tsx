type HomePhotoProps = {
  name: "football" | "basketball" | "tennis" | "athletics" | "community";
  alt: string;
  sizes?: string;
};

export function HomePhoto({ name, alt, sizes = "(max-width: 400px) calc(100vw - 32px), (max-width: 600px) 92vw, (max-width: 1000px) calc(46vw - 12px), (max-width: 1565px) calc(23vw - 18px), 342px" }: HomePhotoProps) {
  const width = name === "community" ? 1280 : 960;
  const widths = name === "community" ? [640, 1280] : [640, 768, 960];
  return (
    <picture>
      <source type="image/avif" srcSet={widths.map((size) => `/images/home/${name}-${size}.avif ${size}w`).join(", ")} sizes={sizes} />
      <img
        src={`/images/home/${name}-${width}.webp`}
        srcSet={`/images/home/${name}-640.webp 640w, /images/home/${name}-${width}.webp ${width}w`}
        sizes={sizes}
        width={width}
        height={width * 0.75}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
