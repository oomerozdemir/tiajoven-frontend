import { useEffect, useRef, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"
import "../styles/shop.css"

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const imgFor = (c) =>
  c?.imagePublicId && cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_fill,g_auto/${c.imagePublicId}`
    : c?.imageUrl || `/img/categories/${c?.slug}.jpg`

export default function CategorySection() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const rowRef = useRef(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/categories")
        setCats(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const visible = useMemo(() => cats.slice(0, 8), [cats])
  if (loading) return <section className="categories"><h3 className="cat-title">Kategoriler</h3><p>Yükleniyor…</p></section>
  if (!visible.length) return null

  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" })

  return (
    <section className="categories">
      <h3 className="cat-title">Kategoriler</h3>

      <div className="cat-grid cat-slider" ref={rowRef}>
        {visible.map((c) => (
          <article className="cat-card" key={c.id}>
            <img src={imgFor(c)} alt={c.name} loading="lazy" />
            <div className="cat-overlay">
              <span className="cat-label">Kategori</span>
              <h4 className="cat-name">{c.name}</h4>
              <Link to={`/kategori/${c.slug}`} className="cat-btn">Keşfet</Link>
            </div>
          </article>
        ))}
      </div>

      {/* mobilde görünen ok butonları */}
      <div className="cat-slider-arrows">
        <button className="cat-arrow cat-arrow--prev" onClick={() => scroll(-1)}>‹</button>
        <button className="cat-arrow cat-arrow--next" onClick={() => scroll(1)}>›</button>
      </div>
    </section>
  )
}
