import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../../lib/api"

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

export default function ProductsList(){
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState(null) // satır içi işlemler için

  // filtreler
  const [q, setQ] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [sort, setSort] = useState("new") // new | title

  // EDIT MODAL
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [title, setTitle] = useState("")
  const [catId, setCatId] = useState("")
  const [sizes, setSizes] = useState("")
  const [desc, setDesc] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState("")

  const fetchItems = async () => {
    setLoading(true); setError("")
    try {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        api.get("/products"),
        api.get("/categories").catch(()=>({ data: [] })),
      ])
      setItems(prods || [])
      setCategories(cats || [])
    } catch (e) {
      setError(e?.response?.data?.message || "Ürünler yüklenemedi.")
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const filtered = useMemo(() => {
    let arr = Array.isArray(items) ? [...items] : []
    // arama
    if (q.trim()) {
      const t = q.trim().toLowerCase()
      arr = arr.filter(p =>
        p.title?.toLowerCase().includes(t) ||
        p.description?.toLowerCase().includes(t) ||
        p.category?.name?.toLowerCase().includes(t)
      )
    }
    // kategori
    if (categoryId) {
      const id = Number(categoryId)
      arr = arr.filter(p => p.categoryId === id || p.category?.id === id)
    }
    // sıralama (yalnızca new/title)
    if (sort === "title") {
      arr.sort((a,b)=> (a.title||"").localeCompare(b.title||""))
    } else {
      arr.sort((a,b)=>{
        const ba = b?.createdAt ? new Date(b.createdAt).getTime() : 0
        const aa = a?.createdAt ? new Date(a.createdAt).getTime() : 0
        return ba - aa
      })
    }
    return arr
  }, [items, q, categoryId, sort])

  const remove = async (id) => {
    if (!confirm("Bu ürünü silmek istediğine emin misin?")) return
    setBusyId(id)
    try {
      await api.delete(`/products/${id}`)
      setItems(prev => prev.filter(p => p.id !== id))
    } catch (e){
      alert(e?.response?.data?.message || "Silinemedi.")
    } finally { setBusyId(null) }
  }

  const toggleFeatured = async (p) => {
    const next = !p.isFeatured
    // optimistik güncelleme
    setItems(prev => prev.map(it => it.id === p.id ? { ...it, isFeatured: next } : it))
    setBusyId(p.id)
    try {
      await api.put(`/products/${p.id}`, { isFeatured: next })
    } catch (e) {
      // geri al
      setItems(prev => prev.map(it => it.id === p.id ? { ...it, isFeatured: !next } : it))
      alert(e?.response?.data?.message || "Güncellenemedi.")
    } finally { setBusyId(null) }
  }

  /* --------------------------
     EDIT: modal aç / formu doldur
  ---------------------------*/
  const openEdit = (p) => {
    setEditItem(p)
    setTitle(p.title || "")
    setCatId(String(p.categoryId || p.category?.id || ""))
    setSizes(typeof p.sizes === "string" ? p.sizes : Array.isArray(p.sizes) ? p.sizes.join(",") : "")
    setDesc(p.description || "")
    setIsFeatured(!!p.isFeatured)
    setFile(null)
    setPreview(null)
    setSaveErr("")
    setOpen(true)
  }

  const uploadToCloudinary = async (file) => {
    const { data: sign } = await api.get("/cloudinary/sign")
    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", sign.apiKey)
    formData.append("timestamp", sign.timestamp)
    formData.append("signature", sign.signature)
    formData.append("folder", sign.folder)
    const cloudUrl = `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`
    const res = await fetch(cloudUrl, { method:"POST", body: formData })
    if (!res.ok) throw new Error("Cloudinary upload failed")
    return await res.json() // { public_id, secure_url, ... }
  }

  const onSave = async (e) => {
    e.preventDefault()
    if (!editItem) return
    setSaving(true); setSaveErr("")
    try {
      // ✅ fiyatı tamamen kaldırdık — payload’ta yok
      const payload = {
        title: title.trim(),
        description: desc,
        sizes,
        categoryId: Number(catId),
        isFeatured,
      }

      // Görsel değiştiyse
      if (file) {
        const up = await uploadToCloudinary(file)
        payload.imagePublicId = up.public_id
        payload.imageUrl = up.secure_url
      }

      const { data } = await api.put(`/products/${editItem.id}`, payload)

      // tabloyu güncelle
      setItems(prev => prev.map(p => p.id === editItem.id ? data : p))
      setOpen(false)
    } catch (err) {
      setSaveErr(err?.response?.data?.message || err.message || "Kaydedilemedi.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="admin-headline" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:12}}>
        <div style={{display:"flex", alignItems:"center", gap:12, flexWrap:"wrap"}}>
          <h2 style={{margin:0}}>Ürünler</h2>
          <span style={{fontSize:12, color:"#6b7280"}}>
            Toplam: {items.length} • Liste: {filtered.length}
          </span>
          {error && <span style={{color:"#b00", fontSize:12}}>{error}</span>}
        </div>
        <div style={{display:"flex", gap:8}}>
          <Link className="btn" to="/admin/products/new">+ Yeni Ürün</Link>
          <button className="btn" onClick={fetchItems} disabled={loading}>
            {loading ? "Yenileniyor…" : "Yenile"}
          </button>
        </div>
      </div>

      {/* Filtre çubuğu */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"1.2fr 1fr 1fr",
        gap:12,
        background:"#fafafa",
        border:"1px solid #eee",
        borderRadius:12,
        padding:12,
        marginBottom:12
      }}>
        <input
          placeholder="Ara: başlık, kategori…"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          style={{height:40, border:"1px solid #ddd", borderRadius:10, padding:"0 12px"}}
        />
        <select
          value={categoryId}
          onChange={(e)=>setCategoryId(e.target.value)}
          style={{height:40, border:"1px solid #ddd", borderRadius:10, padding:"0 12px", background:"#fff"}}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={sort}
          onChange={(e)=>setSort(e.target.value)}
          style={{height:40, border:"1px solid #ddd", borderRadius:10, padding:"0 12px", background:"#fff"}}
        >
          <option value="new">Yeni - İlk</option>
          <option value="title">Başlık (A→Z)</option>
        </select>
      </div>

      {loading ? (
        <div className="table-wrap">
          <div style={{padding:16}}>Yükleniyor…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          border:"1px dashed #ddd",
          borderRadius:12,
          padding:"24px 16px",
          textAlign:"center",
          color:"#6b7280"
        }}>
          Henüz ürün yok veya filtrelere uyan kayıt bulunamadı.
          <div style={{marginTop:8}}>
            <Link className="btn" to="/admin/products/new">+ İlk ürünü ekle</Link>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{width:80}}>Görsel</th>
                <th>Başlık</th>
                {/* Fiyat sütunu kaldırıldı */}
                <th style={{width:160}}>Kategori</th>
                <th style={{width:120}}>Öne Çıkan</th>
                <th style={{width:180}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const img = p.imagePublicId
                  ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${p.imagePublicId}`
                  : p.imageUrl || "/placeholder.jpg"
                return (
                  <tr key={p.id} style={{verticalAlign:"middle"}}>
                    <td>
                      <div style={{width:56, height:56, borderRadius:8, overflow:"hidden", background:"#f3f4f6"}}>
                        <img
                          src={img}
                          alt={p.title}
                          style={{width:"100%", height:"100%", objectFit:"cover", display:"block"}}
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{fontWeight:600}}>{p.title}</div>
                      {p.sizes && (
                        <div style={{fontSize:12, color:"#6b7280", marginTop:2}}>
                          {typeof p.sizes === "string" ? p.sizes : Array.isArray(p.sizes) ? p.sizes.join(", ") : ""}
                        </div>
                      )}
                    </td>
                    <td>{p?.category?.name || "-"}</td>
                    <td>
                      <label style={{display:"inline-flex", alignItems:"center", gap:8}}>
                        <input
                          type="checkbox"
                          checked={!!p.isFeatured}
                          onChange={()=>toggleFeatured(p)}
                          disabled={busyId === p.id}
                        />
                        <span style={{
                          fontSize:12,
                          padding:"4px 8px",
                          borderRadius:999,
                          border:"1px solid #eee",
                          background: p.isFeatured ? "#e6fff1" : "#f5f5f5",
                          color: p.isFeatured ? "#047857" : "#555"
                        }}>
                          {p.isFeatured ? "Evet" : "Hayır"}
                        </span>
                      </label>
                    </td>
                    <td className="td-actions" style={{textAlign:"right", display:"flex", gap:8, justifyContent:"flex-end"}}>
                      <button className="btn" onClick={()=>openEdit(p)}>Düzenle</button>
                      <button
                        className="btn danger"
                        onClick={()=>remove(p.id)}
                        disabled={busyId === p.id}
                        title="Sil"
                      >
                        {busyId === p.id ? "Siliniyor…" : "Sil"}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {open && (
        <div className="modal-backdrop" onClick={()=>!saving && setOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Ürün Düzenle</h3>
            <form onSubmit={onSave} className="adm-form" style={{display:"grid", gap:10}}>
              <label>Başlık *</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} required />

              <label>Kategori *</label>
              <select value={catId} onChange={e=>setCatId(e.target.value)} required>
                <option value="">Seçin…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label>Bedenler</label>
              <input
                value={sizes}
                onChange={e=>setSizes(e.target.value)}
                placeholder="örn: S,M,L veya 46,48,50"
              />

              <label>Açıklama</label>
              <textarea rows={3} value={desc} onChange={e=>setDesc(e.target.value)} />

              <label style={{display:"flex", alignItems:"center", gap:8}}>
                <input type="checkbox" checked={isFeatured} onChange={e=>setIsFeatured(e.target.checked)} />
                Öne Çıkan
              </label>

              <label>Görsel (opsiyonel – değiştir)</label>
              <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
              {preview && (
                <div style={{marginTop:6}}>
                  <img src={preview} alt="Önizleme" style={{maxWidth:180, borderRadius:8}} />
                </div>
              )}

              {saveErr && <div style={{color:"#b00020"}}>{saveErr}</div>}

              <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:6}}>
                <button type="button" disabled={saving} onClick={()=>setOpen(false)}>İptal</button>
                <button type="submit" className="btn" disabled={saving}>
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
