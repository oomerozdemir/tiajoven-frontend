import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"
import { useFavorites } from "../store/favorites"
import "../styles/profilePage.css"

export default function ProfilePage(){
  const [form, setForm] = useState({ name:"", email:"", phone:"", city:"" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  // ⭐ Favoriler
  const { items: favItems, fetchFavorites, loading: favLoading } = useFavorites()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await api.get("/users/me")
        if (mounted) setForm({
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          city: data?.city || "",
        })
      } catch (e) {
        setMsg(e?.response?.data?.message || "Profil getirilemedi")
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    fetchFavorites()

    return () => { mounted = false }
  }, [fetchFavorites])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true); setMsg("")
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        city: form.city,
        email: form.email, // e-posta değişikliği açık kalsın istiyorsan
      }
      const { data } = await api.put("/users/me", payload)
      setForm({
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        city: data?.city || "",
      })
      setMsg("Bilgiler güncellendi ✅")
    } catch (e) {
      setMsg(e?.response?.data?.message || "Kaydedilemedi")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="profile-container"><p>Yükleniyor…</p></div>

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profil</h1>

      {/* ⭐ Favorilerim Kartı */}
      <section className="profile-cards">
        <article className="profile-card profile-card--accent">
          <div className="pc-head">
            <span className="pc-badge">Sık Kullanılan</span>
            <h3 className="pc-title">Favorilerim</h3>
          </div>
          <p className="pc-text">
            {favLoading ? "Yükleniyor…" : `${favItems.length} ürün kaydedildi`}
          </p>
          <Link to="/favorilerim" className="pc-btn" aria-label="Favorilerime git">
            Favorilerime Git →
          </Link>
        </article>
      </section>

      {/* Profil Formu */}
      <form className="profile-form" onSubmit={onSave}>
        <label>Ad Soyad</label>
        <input name="name" value={form.name} onChange={onChange} placeholder="Adınız" />

        <label>E-posta</label>
        <input type="email" name="email" value={form.email} onChange={onChange} placeholder="E-posta" />

        <label>Telefon</label>
        <input name="phone" value={form.phone} onChange={onChange} placeholder="Telefon" />

        <label>Şehir</label>
        <input name="city" value={form.city} onChange={onChange} placeholder="Şehir" />

        <button type="submit" disabled={saving}>{saving ? "Kaydediliyor…" : "Kaydet"}</button>
        {msg && <p className="profile-success">{msg}</p>}
      </form>
    </div>
  )
}
