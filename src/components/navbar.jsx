import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, Search, ChevronDown, Phone, MessageCircle, User, LogOut, LogIn, Heart } from "lucide-react"
import "../styles/navbar.css"
import { useAuth } from "../store/auth"
import { api } from "../lib/api"

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [userMenu, setUserMenu] = useState(false)
  const userRef = useRef(null)
  const navigate = useNavigate()
  const { user, token, logout } = useAuth()
  const [categories, setCategories] = useState([])
  const [catOpen, setCatOpen] = useState(false)

  const whatsappHref = `https://wa.me/905555555555?text=${encodeURIComponent(
    "Merhaba, tiajoven ürünleri hakkında bilgi almak istiyorum."
  )}`

  const onSearch = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/arama?q=${encodeURIComponent(q)}`)
  }

  // dışarı tıklanınca menüyü kapat
  useEffect(() => {
    const onDocClick = (e) => {
      if (!userRef.current) return
      if (!userRef.current.contains(e.target)) setUserMenu(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
  (async () => {
    try {
      const { data } = await api.get("/categories")
      setCategories(data || [])
    } catch (e) {
      console.error("Kategori yüklenemedi", e)
    }
  })()
}, [])

useEffect(() => {
  const handleOutside = (e) => {
    if (!e.target.closest(".chip-dropdown")) setCatOpen(false)
  }
  document.addEventListener("mousedown", handleOutside)
  return () => document.removeEventListener("mousedown", handleOutside)
}, [])
  return (
    <header className="tj-header">
      <div className="container">
        <div className="tj-topbar">
          <button className="tj-burger" onClick={() => setOpen((s) => !s)}>
            <Menu size={22} />
          </button>

          <Link to="/" className="tj-logo">
            Tiajoven
          </Link>

          <div className="tj-actions hide-on-mobile">
            <a className="icon-btn" href={whatsappHref} target="_blank" rel="noreferrer" title="Whatsapp">
              <Phone size={18} />
            </a>
            <Link className="icon-btn" to="/iletisim" title="İletişim">
              <MessageCircle size={18} />
            </Link>

            {token && (
  <Link className="icon-btn" to="/favorilerim" title="Favorilerim">
    <Heart size={18}/>
  </Link>
)}

            {/* Kullanıcı kısmı */}
            {!token ? (
              <div className="tj-auth-links">
                <Link className="link-sm" to="/login">
                  <LogIn size={16} /> Giriş
                </Link>
                <Link className="link-sm solid" to="/register">
                  Kayıt
                </Link>
              </div>
            ) : (
              <div className="tj-user" ref={userRef}>
                <button className="tj-userbtn" onClick={() => setUserMenu((v) => !v)}>
                  <User size={20} />
                  <ChevronDown size={16} />
                </button>
               {userMenu && (
  <div className="tj-usermenu">
    <Link to="/profil" className="tj-usermenu-item" onClick={() => setUserMenu(false)}>
      Profilim
    </Link>

    {user?.isAdmin && (
      <Link
        to="/admin"
        className="tj-usermenu-item"
        onClick={() => setUserMenu(false)}
      >
        Admin
      </Link>
    )}

    <button
      className="tj-usermenu-item danger"
      onClick={() => { logout(); setUserMenu(false); navigate("/"); }}
    >
      <LogOut size={16} /> Çıkış Yap
    </button>
  </div>
)}
              </div>
            )}
          </div>
        </div>

        {/* Arama ve kategori barı */}
        <div className="tj-chipbar">
          <div className="chip-dropdown">
  <div className="chip" onClick={() => setCatOpen(!catOpen)}>
    Kategoriler <span style={{ fontSize: "12px" }}>▾</span>
  </div>

  <div className={`dropdown-menu ${catOpen ? "active" : ""}`}>
    {categories.length > 0 ? (
      categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/kategori/${cat.slug}`}
          onClick={() => setCatOpen(false)}
        >
          {cat.name}
        </Link>
      ))
    ) : (
      <span style={{ display: "block", padding: "10px 16px", color: "#999" }}>
        Henüz kategori yok
      </span>
    )}
  </div>
</div>
          {/*<Link className="chip" to="/koleksiyonlar?tag=yeni">
            Yeni Gelenler
          </Link>
*/}
          <Link className="chip" to="/urunler">Tüm Ürünler</Link>
          
          <form className="tj-search" onSubmit={onSearch}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara…" />
            <button type="submit">
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
