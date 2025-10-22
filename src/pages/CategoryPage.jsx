// src/pages/CategoryPage.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/productCard";
import "../styles/shop.css";
import CategoryChips from "../components/categoryChips";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowRef = useRef(null);
  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.85, 360);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/products/category/${slug}`);
        setCategory(data.category);
        setItems(data.items);
      } catch (err) {
        console.error("Kategori ürünleri alınamadı:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div className="container center"><div className="spinner" /><p>Yükleniyor...</p></div>;
  if (!category) return <p>Kategori bulunamadı.</p>;

  return (
    <div className="shop-wrapper">
      <nav className="breadcrumb breadcrumb--offset">
        <Link to="/urunler">Kategori</Link>
        <span>›</span>
        <span className="active">{category.name}</span>
      </nav>

      <CategoryChips />

      <div className="shop-header shop-header--tight">
        <h1>{category.name}</h1>
      </div>

      {/* Masaüstü: grid / Mobil: slider */}
      <div className="catalog-grid catalog-slider" ref={rowRef}>
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* oklar sadece mobilde */}
      <div className="catlg-slider-arrows">
        <button className="catlg-arrow" onClick={() => scroll(-1)} aria-label="Geri">‹</button>
        <button className="catlg-arrow" onClick={() => scroll(1)} aria-label="İleri">›</button>
      </div>
    </div>
  );
}
