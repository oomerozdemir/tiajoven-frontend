import { useEffect, useMemo, useState } from "react"
import { api } from "../../lib/api"

export default function ProductNew(){
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sizes, setSizes] = useState("")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isFeatured, setIsFeatured] = useState(false)

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState("")

  // Kategorileri yükle
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await api.get("/categories")
        if (mounted) setCategories(data || [])
      } catch (e) {
        setMsg("Kategoriler yüklenemedi.")
      }
    })()
    return () => { mounted = false }
  }, [])

  // Görsel önizleme
  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

const canSubmit = useMemo(() => {
  return title.trim() && categoryId     
}, [title, categoryId])

  const uploadToCloudinary = async (file) => {
    // backend'den signature al (admin korumalı)
    const { data: sign } = await api.get("/cloudinary/sign")
    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", sign.apiKey)
    formData.append("timestamp", sign.timestamp)
    formData.append("signature", sign.signature)
    formData.append("folder", sign.folder)

    // direkt Cloudinary'ye gönder
    const cloudUrl = `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`
    const res = await fetch(cloudUrl, { method: "POST", body: formData })
    if (!res.ok) throw new Error("Cloudinary upload failed")
    const json = await res.json()
    return json  // { public_id, secure_url, ... }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg("")
    if (!canSubmit) {
      setMsg("Lütfen zorunlu alanları doldurun.")
      return
    }
    setLoading(true)

    try {
      let imagePublicId = null
      let imageUrl = null

      if (file) {
        const uploaded = await uploadToCloudinary(file)
        imagePublicId = uploaded.public_id
        imageUrl = uploaded.secure_url
      }


      await api.post("/products", {
        title: title.trim(),
        description,
        sizes,
        categoryId: Number(categoryId),
        isFeatured,               // ✅ admin seçimine göre gönder
        imagePublicId,
        imageUrl,
      })

      setMsg("Ürün eklendi ✅")
      // formu sıfırla
      setTitle("")
      setDescription("")
      setSizes("")
      setCategoryId("")
      setIsFeatured(false)
      setFile(null)
      setPreview(null)
    } catch (err) {
      console.error(err)
      setMsg("Hata: " + (err?.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 720, margin: "24px auto" }}>
      <h2>Yeni Ürün</h2>

      <form onSubmit={onSubmit} className="adm-form" style={{ display: "grid", gap: 12 }}>
        <label>Başlık *</label>
        <input
          placeholder="Örn. Su Geçirmez Yağmurluk"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

       
        <label>Kategori *</label>
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Seçin…</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Bedenler</label>
        <input
          placeholder="örn: S,M,L veya 46,48,50"
          value={sizes}
          onChange={e => setSizes(e.target.value)}
        />

        <label>Açıklama</label>
        <textarea
          placeholder="Kısa açıklama"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />

        <label>Görsel</label>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        {preview && (
          <div style={{ marginTop: 8 }}>
            <img src={preview} alt="Önizleme" style={{ maxWidth: 240, borderRadius: 8 }} />
          </div>
        )}

        <label style={{ display:"flex", alignItems:"center", gap:8 }}>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e)=> setIsFeatured(e.target.checked)}
          />
          Öne çıkar (Anasayfada göster)
        </label>

        <button type="submit" disabled={loading || !canSubmit}>
          {loading ? "Yükleniyor..." : "Kaydet"}
        </button>

        {msg && <p style={{ marginTop: 8 }}>{msg}</p>}

        {!categories.length && (
          <p style={{ color: "#b00" }}>
            Kategori bulunamadı. Lütfen önce Admin &rarr; Kategoriler’den kategori ekleyin.
          </p>
        )}
      </form>
    </div>
  )
}
