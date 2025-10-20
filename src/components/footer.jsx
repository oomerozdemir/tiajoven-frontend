import { Instagram, Facebook, Phone, Mail } from "lucide-react"
import "../styles/footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* Sol */}
        <div className="footer-col">
          <h3 className="footer-logo">tiajoven</h3>
          <p className="footer-desc">
            Tiajoven, büyük beden kadınlara özel şıklığı ve rahatlığı bir araya getirir.
            Kendinizi iyi hissettiren stiller için doğru adrestesiniz.
          </p>
        </div>

        {/* Orta */}
        <div className="footer-col">
          <h4>Hızlı Erişim</h4>
          <ul>
            <li><a href="/">Ana Sayfa</a></li>
            <li><a href="/urunler">Tüm Ürünler</a></li>
            <li><a href="/hakkimizda">Hakkımızda</a></li>
            <li><a href="/iletisim">İletişim</a></li>
          </ul>
        </div>

        {/* Sağ */}
        <div className="footer-col">
          <h4>İletişim</h4>
          <ul className="footer-contact">
            <li><Phone size={16}/> <a href="tel:+905555555555">+90 533 777 47 71</a></li>
            <li><Mail size={16}/> <a href="mailto:info@tiajoven.com">iletisim@tiajoventekstil.com</a></li>
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
