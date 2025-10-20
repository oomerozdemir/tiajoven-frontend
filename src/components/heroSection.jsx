import "../styles/heroSection.css"

export default function HeroSection() {
  const whatsappRetail =
    "https://wa.me/905555555555?text=Merhaba%2C%20tiajoven%20ürünleri%20hakkında%20bilgi%20almak%20istiyorum."

  const whatsappWholesale =
    "https://wa.me/905555555555?text=Merhaba%2C%20toptan%20giyim%20hakk%C4%B1nda%20bilgi%20ve%20fiyat%20teklifi%20almak%20istiyorum.%20(Marka%3A%20Tiajoven)"

  return (
    <>
      <section className="hero">
        <div className="hero-media">
           <img
    src="/images/heroSection.png"
    alt="Tiajoven vitrin"
    loading="eager"
    fetchpriority="high"
    decoding="async"
    className="hero-img"
  />
        </div>

        <div className="hero-gradient" />

        <div className="hero-content">
          <div className="hero-copy">
            <h1 className="hero-title">Tiajoven</h1>
            <p className="hero-text">
              Büyük beden kadın giyiminde modern, rahat ve zarif seçimler.
              Tarzını yansıtan parçaları keşfet, stilini özgürce ifade et.
            </p>
            <a
              href={whatsappRetail}
              target="_blank"
              rel="noreferrer"
              className="hero-btn"
            >
              WhatsApp’tan Sor →
            </a>
          </div>
        </div>
      </section>

      <section className="hero-highlights">
        <article className="h-card">
          <div className="h-badge">Perakende Ağı</div>
          <h3 className="h-title">Türkiye’nin 66 ilinde iş ortaklarımız var</h3>
          <p className="h-text">
            Perakende mağazalarla aktif çalışıyoruz; koleksiyonlarımız ülke genelinde
            hızla müşteriye ulaşıyor.
          </p>
        </article>

        <article className="h-card h-accent">
          <div className="h-badge">Toptan Giyim</div>
          <h3 className="h-title">Mağazanız için koleksiyon tedarik edelim</h3>
          <p className="h-text">
            Hızlı üretim, esnek adet, sezon trendleri. Toptan sipariş ve fiyat teklifi için bize ulaşın.
          </p>
          <a
            href={whatsappWholesale}
            target="_blank"
            rel="noreferrer"
            className="h-cta"
          >
            Toptan Teklif Al
          </a>
        </article>
      </section>
    </>
  )
}
