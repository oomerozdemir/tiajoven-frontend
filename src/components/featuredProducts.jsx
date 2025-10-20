import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"
import ProductCard from "./productCard"
import "../styles/shop.css"

export default function FeaturedProducts() {
  const [items, setItems] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get("/products")
        const featured = (data || []).filter(p => p.isFeatured)
        setItems(featured)
      } catch (e) {
        console.error("Featured fetch error", e)
      }
    })()
  }, [])

  if (!items.length) return null

  return (
    <section className="featured-section container">
      <h2 className="section-title">Öne Çıkanlar</h2>

      <div className="product-grid">
        {items.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="show-all-wrapper">
        <Link to="/urunler" className="show-all-link">
          Tümünü Gör
        </Link>
      </div>
    </section>
  )
}
