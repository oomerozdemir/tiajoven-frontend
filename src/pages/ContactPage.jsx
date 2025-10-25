import "../styles/contactPage.css";
import { useState, useMemo } from "react";
import SEO from "../components/seo";

export default function Contact() {
   const [status, setStatus] = useState({ type: "", msg: "" });

  const API_BASE = import.meta.env.VITE_API_URL || "";

  async function handleSubmit(e) {
  e.preventDefault();

  const formEl = e.currentTarget;        
  setStatus({ type: "loading", msg: "Gönderiliyor..." });

  const form = new FormData(formEl);
  if (form.get("website")) {
    setStatus({ type: "error", msg: "Spam algılandı." });
    return;
  }

  const payload = Object.fromEntries(form.entries());

  try {
    const res = await fetch(`${API_BASE}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = null;
    try { data = await res.json(); } catch {}

    if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);

    setStatus({ type: "success", msg: "Mesajınız alındı. Teşekkürler!" });

    formEl.reset();                         // 👈 artık güvenli
  } catch (err) {
    setStatus({ type: "error", msg: err.message || "Gönderilemedi." });
  }
}

    // ---- SEO alanı ----
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.tiajoven.com";
  const pageUrl = `${origin}/iletisim`;
  const pageTitle = "Tiajoven | Toptan Büyük Beden Giyim Üreticisi";
  const pageDescription = "Tiajoven ile iletişime geçin: adres, telefon, e-posta ve iletişim formu.";
  const ogImage = `${origin}/images/og-contact.jpg`; 

  const structuredData = useMemo(() => ([
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Anasayfa", item: origin + "/" },
        { "@type": "ListItem", position: 2, name: "İletişim", item: pageUrl }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Tiajoven Tekstil",
      url: origin,
      email: "info@tiajoven.com",
      telephone: "+90 533 777 47 71",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Şair Nigar Sok No 58/4 D:7 Osmanbey.",
        addressLocality: "Şişli",
        addressRegion: "İstanbul",
        addressCountry: "TR"
      },
      contactPoint: [{
        "@type": "ContactPoint",
       telephone: "+90 533 777 47 71",
        contactType: "customer support",
       areaServed: "TR",
        availableLanguage: ["tr"]
      }]
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "İletişim",
      url: pageUrl
    }
  ]), [origin, pageUrl]);

  return (
    <section className="contact-wrap">
      <SEO
        title={pageTitle}
       description={pageDescription}
        url={pageUrl}
        image={ogImage}
        type="website"
        structuredData={structuredData}
      />
      <div className="contact-grid">
        {/* Sol: Şirket Bilgileri */}
        <aside className="contact-company">
          <h3>Şirket Bilgileri</h3>

          <div className="c-block">
            <div className="c-label">Ünvan</div>
            <div className="c-value">
              Tiajoven Tekstil<br />
              Şair Nigar Sok No 58/4 D:7 Osmanbey.<br />
              Şişli/İstanbul
            </div>
          </div>

          <div className="c-block">
            <div className="c-label">Telefon</div>
            <a className="c-value" href="tel:+905337774771">+90 533 777 47 71</a>
          </div>

     

          <div className="c-block">
            <div className="c-label">E-Posta</div>
            <a className="c-value" href="mailto:info@tiajoven.com">
              iletisim@tiajoven.com
            </a>
          </div>
        </aside>

        {/* Sağ: Form */}
        <div className="contact-form">
          <h3>İletişim Formu</h3>
          <p className="muted">Aşağıdaki formu kullanarak bize mesajınızı iletebilirsiniz.</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot */}
            <input type="text" name="website" autoComplete="off" tabIndex="-1" className="hp" />

            <div className="form-grid">
              <div className="f-group">
                <label>Ad*</label>
                <input name="firstName" required />
              </div>
              <div className="f-group">
                <label>Soyad*</label>
                <input name="lastName" required />
              </div>

              <div className="f-group">
                <label>+90 Cep Telefonu*</label>
                <input name="phone" type="tel" pattern="^[0-9\\s()+-]{8,}$" required />
              </div>

              <div className="f-group">
                <label>E-posta*</label>
                <input name="email" type="email" required />
              </div>

              <div className="f-group f-span2">
                <label>Konu*</label>
                <select name="subject" required defaultValue="">
                  <option value="" disabled>Seçiniz</option>
                  <option>Ürün Bilgisi</option>
                  <option>Diğer</option>
                </select>
              </div>

              <div className="f-group f-span2">
                <label>Mesajınız*</label>
                <textarea name="message" required maxLength={500} rows={5} />
                <div className="hint">Kalan: 500</div>
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={status.type === "loading"}>
              Gönder
            </button>

            {status.type && (
              <div className={`form-status ${status.type}`}>{status.msg}</div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
