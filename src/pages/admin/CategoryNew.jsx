import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../lib/api"

export default function CategoryNew(){
  const nav = useNavigate()
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const canSubmit = useMemo(()=> name.trim(), [name])

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
    return await res.json() // { public_id, secure_url, ... }
  }

  const onFile = (e) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSaving(true); setMsg("")
    try{
      let imageUrl = null
      let imagePublicId = null
      if(file){
        const up = await uploadToCloudinary(file)
        imagePublicId = up.public_id
        imageUrl = up.secure_url
      }
      await api.post("/categories", {
        name: name.trim(),
        description: desc,
        imageUrl,
        imagePublicId,
      })
      nav("/admin/categories")
    }catch(err){
      setMsg(err?.response?.data?.message || err.message)
    }finally{ setSaving(false) }
  }

  return (
    <div className="container" style={{maxWidth:640, margin:"24px auto"}}>
      <h2>Yeni Kategori</h2>
      <form onSubmit={onSubmit} className="adm-form" style={{display:"grid", gap:12}}>
        <label>Ad *</label>
        <input value={name} onChange={e=>setName(e.target.value)} required />

        <label>Açıklama</label>
        <textarea rows={3} value={desc} onChange={e=>setDesc(e.target.value)} />

        <label>Görsel (opsiyonel)</label>
        <input type="file" accept="image/*" onChange={onFile} />
        {preview && <img src={preview} alt="Önizleme" style={{maxWidth:220, borderRadius:8}} />}

        {msg && <p style={{color:"#b00"}}>{msg}</p>}
        <button type="submit" className="btn" disabled={saving || !canSubmit}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  )
}
