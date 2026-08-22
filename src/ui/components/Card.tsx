type CardProps = {
  label: string;
  title: string;
  copy: string;
  image?: string;
};

export function Card({ label, title, copy, image }: CardProps) {
  return (
    <article className="content-card">
      {image ? <img src={image} alt="" loading="lazy" /> : null}
      <span>{label}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
      <a href="/contact">Start enquiry</a>
    </article>
  );
}
