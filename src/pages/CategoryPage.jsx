import { useEffect, useRef, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/productCard";
import "../styles/shop.css";
import CategoryChips from "../components/categoryChips";
import SEO from "../components/seo";

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

  // --- SEO: hook'lar her zaman aynı sırada çağrılsın ---
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.tiajoven.com";
  const pageUrl = `${origin}/kategori/${slug}`;
  const pageTitle = `${category?.name ?? "Kategori"} | Tiajoven`;
  const pageDescription = category?.name
    ? `${category.name} kategorisindeki ürünleri keşfet. Yeni sezon ve trend parçalar uygun toptan fiyatlarla.`
    : "Tiajoven kategorileri.";
  const ogImage = useMemo(() => {
    const first = items?.[0];
    return first?.imageUrl || `${origin}/images/og-default.jpg`;
  }, [items, origin]);

  const structuredData = useMemo(() => {
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: (items || []).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${origin}/urun/${p.slug}`
      }))
    };
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kategori", item: `${origin}/urunler` },
        { "@type": "ListItem", position: 2, name: category?.name ?? "Kategori", item: pageUrl }
      ]
    };
    return [breadcrumb, itemList];
  }, [items, category?.name, pageUrl, origin]);

  if (loading) {
    return (
      <>
        <SEO title={pageTitle} description={pageDescription} url={pageUrl} image={ogImage} type="collection" />
        <div className="container center"><div className="spinner" /><p>Yükleniyor...</p></div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <SEO title={pageTitle} description={pageDescription} url={pageUrl} image={ogImage} type="collection" />
        <p>Kategori bulunamadı.</p>
      </>
    );
  }

  return (
    <div className="shop-wrapper">
      <SEO
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        image={ogImage}
        type="collection"
        structuredData={structuredData}
      />

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
