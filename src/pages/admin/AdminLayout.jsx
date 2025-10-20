import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { Package, PlusCircle, Store, LogOut, Shirt } from "lucide-react"
import "./adminStyles/admin.css"
import { useAuth } from "../../store/auth"

export default function AdminLayout(){
  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <div className="admin-wrap">
      <aside className="admin-aside">
        <div className="admin-brand">
          <Link to="/">tiajoven</Link>
          <small>Admin</small>
        </div>

        <nav className="admin-nav">
          <NavLink end to="/admin">
            <Store size={18}/> <span>Panel</span>
          </NavLink>
           <NavLink to="/admin/categories">
            <Package size={18}/> <span>Kategoriler</span>
          </NavLink>
          <NavLink to="/admin/products">
            <Shirt size={18}/> <span>Ürünler</span>
          </NavLink>
          <NavLink to="/admin/products/new">
            <PlusCircle size={18}/> <span>Ürün Ekle</span>
          </NavLink>
          <NavLink to="/admin/messages">
        <Package size={18}/> <span>Mesajlar</span>
      </NavLink>
              </nav>

        <button
          className="admin-logout"
          onClick={() => { logout(); navigate("/"); }}
        >
          <LogOut size={18}/> Çıkış
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <h1>Yönetim Paneli</h1>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </section>
    </div>
  )
}
