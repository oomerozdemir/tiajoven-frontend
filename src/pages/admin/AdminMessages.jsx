import { useEffect, useState } from "react"
import { Check, Trash2 } from "lucide-react"
import { useAuth } from "../../store/auth"          
import "./adminStyles/admin.css"

export default function AdminMessages(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_BASE = import.meta.env.VITE_API_URL || ""
  const token = useAuth(s => s.token)             

  async function load(){
    try {
      setLoading(true)
      setError("")

      if (!token) {
        setItems([])
        throw new Error("Oturum gerekli. Lütfen giriş yapın.")
      }

      const res = await fetch(`${API_BASE}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const raw = await res.text()
      let data = null
      try { data = JSON.parse(raw) } catch {}

      if (res.status === 401) throw new Error("Oturum gerekli. Lütfen giriş yapın.")
      if (res.status === 403) throw new Error("Admin yetkisi gerekli.")
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`)

      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setItems([])
      setError(err.message || "Mesajlar alınamadı.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [token])           

  async function markRead(id){
    try {
      if (!token) return setError("Oturum gerekli.")
      await fetch(`${API_BASE}/api/messages/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      })
      load()
    } catch (e) { setError(e.message || "Güncellenemedi.") }
  }

  async function remove(id){
    try {
      if (!token) return setError("Oturum gerekli.")
      await fetch(`${API_BASE}/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      load()
    } catch (e) { setError(e.message || "Silinemedi.") }
  }

  return (
    <div>
      <div className="admin-headline">
        <h2>İletişim Mesajları</h2>
      </div>

      {error && <div className="form-status error" style={{marginBottom:12}}>{error}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Ad Soyad</th>
              <th>Telefon</th>
              <th>E-posta</th>
              <th>Konu</th>
              <th>Mesaj</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8">Yükleniyor…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="8">Kayıt yok</td></tr>
            ) : items.map(m => (
              <tr key={m.id}>
                <td>{new Date(m.createdAt).toLocaleString()}</td>
                <td>{m.firstName} {m.lastName}</td>
                <td>{m.phone}</td>
                <td>{m.email}</td>
                <td>{m.subject}</td>
                <td style={{maxWidth:320, whiteSpace:"pre-wrap"}}>{m.message}</td>
                <td>{m.readAt ? "Okundu" : "Yeni"}</td>
                <td className="td-actions">
                  {!m.readAt && (
                    <button className="btn" onClick={()=>markRead(m.id)}>
                      <Check size={16}/> Okundu
                    </button>
                  )}
                  <button className="btn danger" onClick={()=>remove(m.id)}>
                    <Trash2 size={16}/> Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
