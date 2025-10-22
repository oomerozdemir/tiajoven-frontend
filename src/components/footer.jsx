import { Instagram, Facebook, Phone, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import "../styles/footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* Sol */}
        <div className="footer-col">
          <h3 className="footer-logo">tiajoven</h3>
          <p className="footer-desc">
            Tiajoven, büyük beden kadın giyime özel şıklığı ve rahatlığı bir araya getirir.
            Kendinizi iyi hissettiren stiller için doğru adrestesiniz.
          </p>
        </div>

        {/* Orta */}
        <div className="footer-col">
          <h4>Hızlı Erişim</h4>
          <ul>
             <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/urunler">Tüm Ürünler</Link></li>
            <li><Link to="/hakkimizda">Hakkımızda</Link></li>
            <li><Link to="/iletisim">İletişim</Link></li>
          </ul>
        </div>

        {/* Sağ */}
        <div className="footer-col">
          <h4>İletişim</h4>
          <ul className="footer-contact">
            <li><Phone size={16}/> <a href="tel:+905337774771">+90 533 777 47 71</a></li>
            <li><Mail size={16}/> <a href="mailto:info@tiajoven.com">info@tiajoventekstil.com</a></li>
          </ul>
          <div className="footer-socials">
            <a href="https://www.instagram.com/tiajoventekstil" target="_blank" rel="noreferrer"><Instagram size={18}/></a>
            <a href="https://www.facebook.com/profile.php?id=100049616186763" target="_blank" rel="noreferrer"><Facebook size={18}/></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Tiajoven. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  )
}
