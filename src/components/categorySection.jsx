import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"
import "../styles/categorySection.css"

// Cloudinary adı .env'den
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

// Görsel seçici: 1) imagePublicId (Cloudinary) 2) imageUrl (DB) 3) statik slug görseli
const imgFor = (c) => {
  if (c?.imagePublicId && cloudName) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_fill,g_auto/${c.imagePublicId}`
  }
  if (c?.imageUrl) return c.imageUrl
  return `/img/categories/${c?.slug}.jpg`
}

export default function CategorySection(){
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)

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

  // Tasarım aynı kalsın diye 6 gösteriyoruz (istersen arttır/azalt)
  const visible = useMemo(() => cats.slice(0, 6), [cats])

  if (loading) {
    return (
      <section className="categories">
        <h3 className="cat-title">Kategoriler</h3>
        <div style={{color:"#666"}}>Yükleniyor…</div>
      </section>
    )
  }
  if (!visible.length) return null

  return (
    <section className="categories">
      <h3 className="cat-title">Kategoriler</h3>

      <div className="cat-grid">
        {visible.map(c => (
          <article className="cat-card" key={c.id}>
            <img
              src={imgFor(c)}
              alt={c.name}
              loading="lazy"
              onError={(e) => {
                // Placeholder: degrade SVG
                const svg = encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'>
                    <defs>
                      <linearGradient id='g' x1='0' x2='0' y1='0' y2='1'>
                        <stop offset='0%' stop-color='#ddd'/>
                        <stop offset='100%' stop-color='#bbb'/>
                      </linearGradient>
                    </defs>
                    <rect width='100%' height='100%' fill='url(#g)'/>
                    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                          font-size='64' fill='#444' font-family='Arial, sans-serif'>${c.name}</text>
                  </svg>`
                )
                e.currentTarget.src = `data:image/svg+xml;utf8,${svg}`
              }}
            />
            <div className="cat-overlay">
              <span className="cat-label">Kategori</span>
              <h4 className="cat-name">{c.name}</h4>
              <Link to={`/kategori/${c.slug}`} className="cat-btn">Keşfet</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
