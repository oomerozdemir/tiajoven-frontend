import { Heart, MessageCircle } from "lucide-react"
import { useFavorites } from "../store/favorites"
import { useAuth } from "../store/auth"
import "../styles/shop.css"

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'>
       <rect width='100%' height='100%' fill='#f3f4f6'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
             font-size='20' fill='#9ca3af'>Görsel yok</text>
     </svg>`
  )

export default function ProductCard({ product }) {
  const { token } = useAuth()
  const { items: favIds, toggleFavorite } = useFavorites()
  const isFav = Array.isArray(favIds) && favIds.includes(product.id)

  const handleFav = () => {
    if (!token) return alert("Favorilere eklemek için giriş yapın.")
    toggleFavorite(product.id)
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const imgFromCloud =
    product?.imagePublicId && cloudName
      ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_fill,g_auto/${product.imagePublicId}`
      : null

  const imageUrl = imgFromCloud || product?.imageUrl || FALLBACK_IMG

  const sizes =
    typeof product?.sizes === "string"
      ? product.sizes.split(",").map(s => s.trim()).filter(Boolean)
      : Array.isArray(product?.sizes) ? product.sizes : []

  // ✅ WhatsApp numaranı buraya gir (başında +90 olacak şekilde)
  const phoneNumber = "+905551112233"

  const handleWhatsapp = () => {
    const text = encodeURIComponent(
      `Merhaba, "${product?.title}" adlı ürün hakkında bilgi almak istiyorum.`
    )
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank")
  }

  return (
    <article className="fp-card reveal" data-id={product.id}>
      <div className="fp-media">
        {product.isFeatured ? <span className="fp-badge">Öne Çıkan</span> : null}

        <img src={imageUrl} alt={product?.title || `Ürün #${product?.id}`} loading="lazy" />

        <button
          type="button"
          className={`fp-heart ${isFav ? "is-active" : ""}`}
          onClick={handleFav}
          title={isFav ? "Favorilerden kaldır" : "Favorilere ekle"}
          aria-label={isFav ? "Favorilerden kaldır" : "Favorilere ekle"}
        >
          <Heart size={18} fill={isFav ? "red" : "none"} />
        </button>
      </div>

      <div className="fp-info">
        <h3 className="fp-title">{product?.title || `Ürün #${product?.id}`}</h3>

        {sizes.length > 0 && (
          <div className="fp-sizes" aria-label="Bedenler">
            {sizes.map(s => <span key={s} className="fp-size">{s}</span>)}
          </div>
        )}

        <div className="fp-meta">
          <span style={{ color:"#6b7280", fontSize:12 }}>
            {product?.category?.name || ""}
          </span>
        </div>

        {/* ✅ WhatsApp Butonu */}
        <button className="fp-whatsapp" onClick={handleWhatsapp}>
          <MessageCircle size={16} />
          <span>WhatsApp ile Sor</span>
        </button>
      </div>
    </article>
  )
}
