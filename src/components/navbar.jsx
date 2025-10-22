// NAVBAR.JSX — yalnız farklı kısımlar
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu, X, Search, ChevronDown, Phone, MessageCircle, User, LogOut, LogIn, Heart
} from "lucide-react";
import "../styles/navbar.css";
import { useAuth } from "../store/auth";
import { api } from "../lib/api";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const userRef = useRef(null);
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const whatsappHref = `https://wa.me/905337774771?text=${encodeURIComponent(
    "Merhaba, tiajoven ürünleri hakkında bilgi almak istiyorum."
  )}`;

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/arama?q=${encodeURIComponent(q)}`);
    setOpen(false); // mobilde menüyü kapat
  };

  // kullanıcı menüsü dış tık
  useEffect(() => {
    const onDocClick = (e) => {
      if (!userRef.current) return;
      if (!userRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // kategoriler
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data || []);
      } catch (e) {
        console.error("Kategori yüklenemedi", e);
      }
    })();
  }, []);

  // kategori: dış tık
  useEffect(() => {
    const handleOutside = (e) => {
      if (!e.target.closest(".chip-dropdown")) setCatOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // mobil menü: scroll kilidi + ESC
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="tj-header" role="banner">
      <div className="container">
        {/* Üst sıra */}
        <div className="tj-topbar">
          <button
            className="tj-burger show-on-mobile"
            aria-label="Menüyü aç"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="tj-logo">Tiajoven</Link>

          <div className="tj-actions hide-on-mobile">
            <a className="icon-btn" href={whatsappHref} target="_blank" rel="noreferrer" title="Whatsapp">
              <Phone size={18} />
            </a>
            <Link className="icon-btn" to="/iletisim" title="İletişim">
              <MessageCircle size={18} />
            </Link>
            {token && (
              <Link className="icon-btn" to="/favorilerim" title="Favorilerim">
                <Heart size={18} />
              </Link>
            )}

            {!token ? (
              <div className="tj-auth-links">
                <Link className="link-sm" to="/login">
                  <LogIn size={16} /> Giriş
                </Link>
                <Link className="link-sm solid" to="/register">Kayıt</Link>
              </div>
            ) : (
              <div className="tj-user" ref={userRef}>
                <button
                  className="tj-userbtn"
                  aria-haspopup="menu"
                  aria-expanded={userMenu}
                  onClick={() => setUserMenu((v) => !v)}
                >
                  <User size={20} />
                  <ChevronDown size={16} />
                </button>
                {userMenu && (
                  <div className="tj-usermenu" role="menu">
                    <Link to="/profil" className="tj-usermenu-item" onClick={() => setUserMenu(false)}>
                      Profilim
                    </Link>
                    {user?.isAdmin && (
                      <Link to="/admin" className="tj-usermenu-item" onClick={() => setUserMenu(false)}>
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

        {/* Alt sıra (tablet/desktop) */}
        <div className="tj-chipbar hide-on-mobile">
          <div className="chip-dropdown">
            <div className="chip" onClick={() => setCatOpen(!catOpen)}>
              Kategoriler <span style={{ fontSize: 12 }}>▾</span>
            </div>
            <div className={`dropdown-menu ${catOpen ? "active" : ""}`}>
              {categories.length ? categories.map((cat) => (
                <Link key={cat.id} to={`/kategori/${cat.slug}`} onClick={() => setCatOpen(false)}>
                  {cat.name}
                </Link>
              )) : <span className="dropdown-empty">Henüz kategori yok</span>}
            </div>
          </div>

          <Link className="chip" to="/urunler">Tüm Ürünler</Link>

          <form className="tj-search" onSubmit={onSearch} role="search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara…" aria-label="Sitede ara" />
            <button type="submit" aria-label="Ara">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* ===== MOBİL MENÜ ===== */}
        <div className={`tj-mobile ${open ? "open" : ""}`} aria-hidden={!open}>
          <div className="tj-mobile-backdrop" onClick={() => setOpen(false)} />
          <nav className="tj-drawer" aria-label="Mobil menü">
            <div className="drawer-head">
              <Link to="/" className="tj-logo" onClick={() => setOpen(false)}>Tiajoven</Link>
              <button className="icon-btn" aria-label="Kapat" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <form className="tj-search tj-search-mobile" onSubmit={onSearch} role="search">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara…" aria-label="Sitede ara" />
              <button type="submit" aria-label="Ara"><Search size={18} /></button>
            </form>

            <div className="mobile-links">
              <div className="chip-dropdown full">
                <button className="chip w-full" onClick={() => setCatOpen((v) => !v)}>
                  Kategoriler <span style={{ fontSize: 12 }}>▾</span>
                </button>
                <div className={`dropdown-menu left-0 ${catOpen ? "active" : ""}`}>
                  {categories.length ? categories.map((cat) => (
                    <Link key={cat.id} to={`/kategori/${cat.slug}`} onClick={() => setOpen(false)}>
                      {cat.name}
                    </Link>
                  )) : <span className="dropdown-empty">Henüz kategori yok</span>}
                </div>
              </div>

              <Link to="/urunler" onClick={() => setOpen(false)}>Tüm Ürünler</Link>
              <Link to="/iletisim" onClick={() => setOpen(false)}>İletişim</Link>
              <a href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Whatsapp</a>

              {!token ? (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}><LogIn size={16}/> Giriş</Link>
                  <Link to="/register" onClick={() => setOpen(false)}>Kayıt</Link>
                </>
              ) : (
                <>
                  <Link to="/profil" onClick={() => setOpen(false)}>Profilim</Link>
                  {user?.isAdmin && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
                  <button className="link-reset danger"
                    onClick={() => { logout(); setOpen(false); navigate("/"); }}>
                    <LogOut size={16}/> Çıkış Yap
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
        {/* ===== MOBİL MENÜ SON ===== */}
      </div>
    </header>
  );
}
