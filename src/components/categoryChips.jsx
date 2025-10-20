import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { api } from "../lib/api"
import "../styles/shop.css"

export default function CategoryChips({ activeSlug = "" }) {
  const [cats, setCats] = useState([])
  const scrollerRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/categories")
        setCats(Array.isArray(data) ? data : [])
      } catch {
        setCats([])
      }
    })()
  }, [])

  const scrollBy = (delta) => scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" })

  return (
    <div className="chipbar-wrap">
      <button type="button" className="chipbar-arrow" onClick={() => scrollBy(-240)} aria-label="Geri">‹</button>

      <div className="chipbar" ref={scrollerRef}>
        {/* İsteğe bağlı: “Tümü” */}
        <Link
          to="/urunler"
          className={`chip ${pathname.startsWith("/urunler") && !activeSlug ? "active" : ""}`}
        >
          Tümü
        </Link>

        {cats.map(c => (
          <Link
            key={c.id}
            to={`/kategori/${c.slug}`}
            className={`chip ${activeSlug === c.slug ? "active" : ""}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <button type="button" className="chipbar-arrow" onClick={() => scrollBy(240)} aria-label="İleri">›</button>
    </div>
  )
}
