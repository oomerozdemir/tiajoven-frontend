import React, { useEffect, useMemo, useState } from "react"
import { useFavorites } from "../store/favorites"
import { api } from "../lib/api"
import "../styles/shop.css"
import ProductCard from "../components/productCard"

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const buildCloudinaryUrl = (publicId) =>
  publicId && cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`
    : null

export default function FavoritesPage() {
  const { items, fetchFavorites, loading } = useFavorites()
  const [fetched, setFetched] = useState([])
  const [busy, setBusy] = useState(false)

  useEffect(() => { fetchFavorites() }, [fetchFavorites])

  // id-only favoriler için detay topla
  const idOnly = useMemo(() => {
    const ids = []
    for (const it of items || []) {
      if (typeof it === "number") ids.push(it)
      else if (it?.productId && !it?.product && !it?.id) ids.push(it.productId)
    }
    return ids
  }, [items])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!idOnly.length) { setFetched([]); return }
      try {
        setBusy(true)
        const { data } = await api.get(`/products?ids=${idOnly.join(",")}`)
        if (mounted) setFetched(Array.isArray(data) ? data : [])
      } finally { if (mounted) setBusy(false) }
    })()
    return () => { mounted = false }
  }, [idOnly])

  // Favori kartlarını ürün nesnesine dönüştür
  const cards = useMemo(() => {
    const arr = []
    for (const it of items || []) {
      if (it?.product) {
        const p = it.product
        arr.push(p)
      } else if (it?.id) {
        arr.push(it)
      }
    }
    for (const p of fetched) {
      if (!arr.some(x => x.id === p.id)) arr.push(p)
    }
    // Görsel fallback’i (imagePublicId yoksa imageUrl ata)
    return arr.map(p => ({
      ...p,
      imageUrl: p.imageUrl || buildCloudinaryUrl(p.imagePublicId),
    }))
  }, [items, fetched])

  return (
    <div className="prod-container">
      <h1 style={{ marginBottom: 12 }}>Favorilerim</h1>

      {(loading || busy) && <p>Yükleniyor…</p>}
      {!loading && !busy && cards.length === 0 && <p>Henüz favori ürününüz yok.</p>}

      {!loading && !busy && cards.length > 0 && (
        <section className="catalog-grid">
          {cards.map(p => <ProductCard key={p.id} product={p} />)}
        </section>
      )}
    </div>
  )
}
