import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/seo";
import "../styles/faq.css";

export default function FAQPage() {
  const navigate = useNavigate();

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://www.tiajoven.com";
  const pageUrl = `${origin}/sss`;
  const pageTitle = "Sıkça Sorulan Sorular | Tiajoven";
  const pageDescription =
    "Tiajoven hakkında merak ettiklerinizi burada bulabilirsiniz. Sipariş, kargo, iade ve toptan satış ile ilgili sıkça sorulan sorular.";

  const faqs = [
    {
      q: "Tiajoven ürünleri sadece toptan mı satılıyor?",
      a: "Evet, Tiajoven yalnızca toptan satış yapmaktadır. Perakende satışımız bulunmamaktadır.",
    },
    {
      q: "Siparişlerimi nasıl verebilirim?",
      a: "Siparişlerinizi whatsapp üzerinden iletişime geçerek kolayca verebilirsiniz.",
    },
    {
      q: "Ürün gönderimi hangi kargo firmasıyla yapılır?",
      a: "Tiajoven, anlaşmalı lojistik firmalarıyla Türkiye’nin 66 iline hızlı teslimat sağlamaktadır.",
    },
   
    {
      q: "Tiajoven üretici mi?",
      a: "Evet, Tiajoven kendi üretimini yapan bir markadır. Kaliteli kumaşlar ve modern kalıplarla üretim yapmaktadır.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const structuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
    [faqs]
  );

  return (
    <div className="faq-container">
      <SEO
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        type="FAQPage"
        structuredData={structuredData}
      />

      <h1 className="faq-title">Sıkça Sorulan Sorular</h1>

      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div
            className={`faq-item ${openIndex === i ? "open" : ""}`}
            key={i}
            onClick={() => toggleFAQ(i)}
          >
            <h2 className="faq-question">{faq.q}</h2>
            <p className={`faq-answer ${openIndex === i ? "show" : ""}`}>{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="faq-contact-cta">
        <h3>Aradığınız cevabı bulamadınız mı?</h3>
        <p>Bizimle iletişime geçerek size özel destek alabilirsiniz.</p>
        <button className="faq-contact-btn" onClick={() => navigate("/iletisim")}>
          İletişim Sayfasına Git
        </button>
      </div>
    </div>
  );
}
