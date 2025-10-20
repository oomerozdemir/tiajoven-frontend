import { Routes, Route, Navigate } from "react-router-dom"
import NavBar from "./components/navbar.jsx"
import Home from "./pages/Home.jsx"
import Footer from "./components/footer.jsx"
import Register from "./pages/RegisterPage.jsx"
import Login from "./pages/LoginPage.jsx"
import ProductsPage from "./pages/ProductsPage.jsx"
import CategoryPage from "./pages/CategoryPage.jsx"
import ProfilePage from "./pages/ProfilPage.jsx"
import ContactPage from "./pages/ContactPage.jsx"
import AboutPage from "./pages/AboutPage.jsx"

import AdminLayout from "./pages/admin/AdminLayout.jsx"
import AdminHome from "./pages/admin/AdminHome.jsx"
import ProductsList from "./pages/admin/ProductList.jsx"
import ProductNew from "./pages/admin/ProductNew.jsx"
import Favorites from "./pages/FavoritesPage.jsx"
import CategoryList from "./pages/admin/CategoryList.jsx"
import CategoryNew from "./pages/admin/CategoryNew.jsx"
import { useAuth } from "./store/auth"
import AdminMessages from "./pages/admin/AdminMessages.jsx"

export default function App(){
  const { user } = useAuth()

  const AdminGuard = ({ children }) =>
    user?.isAdmin ? children : <Navigate to="/" replace />

  return (
    <>
      <NavBar />
      <main className="main">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorilerim" element={<Favorites />} /> 
          <Route path="/urunler" element={<ProductsPage />} />
          <Route path="/kategori/:slug" element={<CategoryPage />} />

          {/* 🔐 Admin panel (nested) */}
          <Route path="/admin/*" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<AdminHome />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/new" element={<ProductNew />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryNew />} />
            <Route path="messages" element={<AdminMessages />} />

          </Route>

          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />

          {/* Optional: 404 */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </main>
      <Footer />
    </>
  )
}


/* 
**********************************YAPILACAKLAR***********************

footer kısmıını ekle
hakkımızda,sss gıbı sayfaları yapalım

mobile responsive olucak
animasyonlar ekleyebiliriz

one cıkanlardan yonlendırme yapalım tıklandıgında kategorısıne gıtsın

seo calismalarini yap

*/