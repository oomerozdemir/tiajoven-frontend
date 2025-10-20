// src/pages/ProductsPage.jsx
import { useEffect, useMemo, useState } from "react"
import { api } from "../lib/api"
import "../styles/shop.css"
import useReveal from "../hooks/useReveal"
import ProductCard from "../components/productCard"
import CategoryChips from "../components/categoryChips"

export default function ProductsPage(){
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])

  const [q, setQ] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [sort, setSort] = useState("new") // new | title
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useReveal(".fp-card")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true); setError("")
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories").catch(() => ({ data: [] })),
        ])
        if (!mounted) return
        setItems(Array.isArray(prodRes.data) ? prodRes.data : [])
        setCategories(Array.isArray(catRes.data) ? catRes.data : [])
      } catch (e) {
        console.error("Ürünler yüklenemedi", e)
        setError(e?.response?.data?.message || "Ürünler yüklenemedi")
      } finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    let arr = Array.isArray(items) ? [...items] : []

    // Arama
    if (q.trim()) {
      const t = q.trim().toLowerCase()
      arr = arr.filter(p =>
        (p.title?.toLowerCase().includes(t)) ||
        (p.description?.toLowerCase().includes(t)) ||
        (p.category?.name?.toLowerCase().includes(t))
      )
    }

    // Kategori
    if (categoryId) {
      const id = Number(categoryId)
      if (!Number.isNaN(id)) {
        arr = arr.filter(p => p.categoryId === id || p.category?.id === id)
      }
    }

    // Sıralama (yalnızca "new" ve "title")
    if (sort === "title") {
      arr.sort((a,b)=> (a.title||"").localeCompare(b.title||""))
    } else {
      arr.sort((a,b) => {
        const ba = b?.createdAt ? new Date(b.createdAt).getTime() : 0
        const aa = a?.createdAt ? new Date(a.createdAt).getTime() : 0
        return ba - aa
      })
    }
    return arr
  }, [items, q, categoryId, sort])

  return (
    <div className="prod-container">
      <header className="prod-filters">
        <input
          className="prod-input"
          placeholder="Ara: ürün, kategori…"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />

        {/* Kategori filtresi (isteğe bağlı: göstermek istiyorsan) */}
        <select
          className="prod-select"
          value={categoryId}
          onChange={(e)=>setCategoryId(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select className="prod-select" value={sort} onChange={(e)=>setSort(e.target.value)}>
          <option value="new">Yeni - İlk</option>
          <option value="title">Başlık (A→Z)</option>
        </select>
      </header>

      <CategoryChips />

      {loading && <p style={{ marginTop: 16 }}>Yükleniyor…</p>}
      {error && !loading && <p style={{ marginTop: 16, color: "#b00" }}>{error}</p>}

      {!loading && !error && (
        <>
          <section className="catalog-grid" style={{ marginTop: 16 }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </section>
          {filtered.length === 0 && (
            <p className="prod-empty">Filtrelere uyan ürün bulunamadı.</p>
          )}
        </>
      )}
    </div>
  )
}
