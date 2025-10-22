import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "./productCard";
import "../styles/shop.css";

export default function FeaturedProducts() {
  const [items, setItems] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/products");
        const featured = (data || []).filter((p) => p.isFeatured);
        setItems(featured);
      } catch (e) {
        console.error("Featured fetch error", e);
      }
    })();
  }, []);

  if (!items.length) return null;

  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.8, 360); // mobilde bir karta yakın kaydır
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="featured-section container">
      <h2 className="section-title">Öne Çıkanlar</h2>

      {/* Masaüstü: grid / Mobil: yatay kaydırma (CSS belirliyor) */}
      <div className="product-grid fp-slider" ref={rowRef}>
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Mobilde görünen slider okları */}
      <div className="fp-slider-arrows">
        <button className="fp-arrow fp-arrow--prev" onClick={() => scroll(-1)} aria-label="Geri">‹</button>
        <button className="fp-arrow fp-arrow--next" onClick={() => scroll(1)} aria-label="İleri">›</button>
      </div>

      <div className="show-all-wrapper">
        <Link to="/urunler" className="show-all-link">Tümünü Gör</Link>
      </div>
    </section>
  );
}
