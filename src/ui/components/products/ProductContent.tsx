import { CardGrid } from "../CardGrid";
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { toProductCard } from "./config";
import { useProducts } from "../../hooks/useProducts";

function CategoryFilter({ value, options, onChange }: { value: string; options: { id: string; name: string }[]; onChange: (category: string) => void }) {
  return <div className="product-filters" role="group" aria-label="Filter products by category">{[{ id: "all", name: "All" }, ...options].map(category => <button key={category.id} type="button" aria-pressed={category.id === value} onClick={() => onChange(category.id)}>{category.name}</button>)}</div>;
}
function QuoteBand() {
  return <section className="product-quote" aria-labelledby="product-quote-title"><h2 id="product-quote-title">Planning a court, turf or track?</h2><p>Get a free site consultation and a tailored quote from our team.</p><div><a className="product-button" href="/contact">Request a Free Consultation</a><a className="product-button product-button-outline" href={`https://wa.me/919716964745?text=${encodeURIComponent("Hello Arena Grid Infra, I would like to discuss a sports infrastructure project.")}`} target="_blank" rel="noreferrer">Chat on WhatsApp</a></div></section>;
}
export function ProductContent() {
  const { products, loading, error, retry } = useProducts();
  const [category, setCategory] = useState("all");
  const options = Array.from(new Map(products.flatMap(product => product.category ? [[product.category.id, product.category] as const] : [])).values());
  const selected = options.some(option => option.id === category) ? category : "all";
  const filtered = products.filter(product => selected === "all" || product.category?.id === selected);
  return <div className="product-catalogue page-shell"><section aria-labelledby="catalogue-title">
    {loading ? <p role="status">Loading products...</p> : error ? <div role="alert"><p>{error}</p><button type="button" className="product-button" onClick={retry}>Try again</button></div> : products.length === 0 ? <p>No products are published yet. Please contact us to discuss your requirements.</p> : <>
      <div className="product-filterbar"><CategoryFilter value={selected} options={options} onChange={setCategory} />
      <p className="product-count" role="status">{filtered.length} product systems</p></div>
      <CardGrid className="product-catalogue-grid compact-catalog-grid" key={selected}>{filtered.map((product) => <ProductCard key={`${product.id}:${product.mainImageUrl}`} product={toProductCard(product)} />)}</CardGrid>
    </>}
  </section><QuoteBand /></div>;
}
