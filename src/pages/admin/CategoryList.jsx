import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../../lib/api"

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

export default function CategoryList(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("/categories")
      setItems(data || [])
    } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  const onDelete = async (id) => {
    if (!confirm("Silinsin mi?")) return
    await api.delete(`/categories/${id}`)
    setItems(s => s.filter(x => x.id !== id))
  }

  const onEditOpen = (c) => {
    setEditId(c.id)
    setEditName(c.name || "")
    setEditDesc(c.description || "")
    setFile(null)
    setPreview(c.imagePublicId
      ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${c.imagePublicId}`
      : c.imageUrl || null)
    setErr("")
    setOpen(true)
  }

  const uploadToCloudinary = async (file) => {
    const { data: sign } = await api.get("/cloudinary/sign")
    const fd = new FormData()
    fd.append("file", file)
    fd.append("api_key", sign.apiKey)
    fd.append("timestamp", sign.timestamp)
    fd.append("signature", sign.signature)
    fd.append("folder", sign.folder)
    const url = `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`
    const res = await fetch(url, { method:"POST", body: fd })
    if(!res.ok) throw new Error("Cloudinary upload failed")
    return await res.json()
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true); setErr("")
    try{
      const payload = {
        name: editName?.trim(),
        description: editDesc,
      }
      if (file) {
        const up = await uploadToCloudinary(file)
        payload.imagePublicId = up.public_id
        payload.imageUrl = up.secure_url
      }
      const { data } = await api.put(`/categories/${editId}`, payload)
      setItems(items.map(i => i.id === editId ? data : i))
      setOpen(false)
    }catch(error){
      setErr(error?.response?.data?.message || error.message)
    }finally{ setSaving(false) }
  }

  return (
    <div>
      <div className="adm-head" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2>Kategoriler</h2>
        <Link className="btn" to="/admin/categories/new">Yeni Kategori</Link>
      </div>

      {loading ? <p>Yükleniyor…</p> : (
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{width:80}}>Görsel</th>
              <th>ID</th>
              <th>Ad</th>
              <th>Slug</th>
              <th style={{textAlign:"right"}}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => {
              const img = c.imagePublicId
                ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${c.imagePublicId}`
                : c.imageUrl || "/placeholder.jpg"
              return (
                <tr key={c.id}>
                  <td>
                    <div style={{width:56, height:56, borderRadius:8, overflow:"hidden", background:"#f3f4f6"}}>
                      <img src={img} alt={c.name} style={{width:"100%", height:"100%", objectFit:"cover"}} />
                    </div>
                  </td>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td style={{textAlign:"right", display:"flex", gap:8, justifyContent:"flex-end"}}>
                    <button className="btn" onClick={()=>onEditOpen(c)}>Düzenle</button>
                    <button className="btn danger" onClick={()=>onDelete(c.id)}>Sil</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {open && (
        <div className="modal-backdrop" onClick={()=>setOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Kategori Düzenle</h3>
            <form onSubmit={onSave} className="adm-form" style={{display:"grid", gap:10}}>
              <label>Ad *</label>
              <input value={editName} onChange={e=>setEditName(e.target.value)} required />

              <label>Açıklama</label>
              <textarea rows={3} value={editDesc} onChange={e=>setEditDesc(e.target.value)} />

              <label>Görsel (değiştir)</label>
              <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} />
              {preview && <img src={preview} alt="Önizleme" style={{maxWidth:220, borderRadius:8}} />}

              {err && <div style={{color:"#b00"}}>{err}</div>}
              <div style={{display:"flex", justifyContent:"flex-end", gap:8}}>
                <button type="button" onClick={()=>setOpen(false)}>İptal</button>
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
