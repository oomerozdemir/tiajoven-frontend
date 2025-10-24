import SEO from "../components/seo"
import "../styles/about.css"

export default function AboutPage() {
  const pageTitle = "Hakkımızda | Tiajoven";
  const pageDescription =
    "Tiajoven, büyük beden kadın giyimde 6 yıllık tecrübeyle Türkiye’nin 66 ilindeki mağazalara toptan satış ile koleksiyonlar sunar.";
  const pageUrl = "https://www.tiajoven.com/hakkimizda";
  const ogImage = "https://www.tiajoven.com/images/og-about.jpg";

  return (
      <>
<SEO
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        image={ogImage}
        type="website"
      />
    <section className="about-wrap">
      <header className="about-hero">
        <h1 className="about-title">Hakkımızda</h1>
        <p className="about-sub">
          6 yıldır büyük beden kadın giyimde <strong>toptan</strong> satış yapıyoruz.
          Ürünlerimiz Türkiye’nin <strong>66 ilindeki</strong> perakende mağazalara ulaşıyor.
        </p>
      </header>

      <section className="about-highlights">
        <article className="a-card">
          <div className="a-kpi">6+</div>
          <div className="a-label">Yıllık Tecrübe</div>
          <p className="a-text">Büyük beden odaklı toptan koleksiyonlar.</p>
        </article>

        <article className="a-card">
          <div className="a-kpi">66</div>
          <div className="a-label">İlde Dağıtım</div>
          <p className="a-text">Türkiye genelinde perakende iş ortakları.</p>
        </article>

        <article className="a-card">
          <div className="a-kpi">Toptan</div>
          <div className="a-label">Üretim & Tedarik</div>
          <p className="a-text">Hızlı üretim, sezon trendleri, esnek adetler.</p>
        </article>
      </section>

      <section className="about-body">
        <h2>Biz kimiz?</h2>
        <p>
          Tiajoven olarak büyük beden kadın giyimi için modern, rahat ve zamansız
          parçalar tasarlıyor, mağazaların raflarına güvenle taşıyoruz. Üretimden
          sevkiyata kadar süreçlerimizi hızlı ve şeffaf yürütür, iş ortaklarımızın
          büyümesine odaklanırız.
        </p>

        <h3>Dağıtım ağımız</h3>
        <p>
          İstanbul merkezli operasyonlarımızla Türkiye’nin 66 ilindeki perakende
          mağazalara düzenli sevkiyat yapıyoruz. Koleksiyonlarımız; sezon trendleri,
          kalıp rahatlığı ve kalite kontrol standartlarıyla öne çıkar.
        </p>

        <div className="about-cta">
          <a className="btn-primary" href="/iletisim">İletişime Geç</a>
        </div>
      </section>
    </section>
    </>
  )
}
