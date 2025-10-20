import "../styles/testimonialsSection.css"
import { useEffect, useRef } from "react"

const TESTIMONIALS = [
  {
    name: "Selin A.",
    city: "İzmir",
    rating: 5,
    quote: "Bedenime uygun ve şık ürünleri bulmak çok kolay oldu. Hızlı kargo, özenli paketleme. Teşekkürler tiajoven!",
  },
  {
    name: "Merve K.",
    city: "İstanbul",
    rating: 4,
    quote: "WhatsApp destek ekibi harika. Kumaş kalitesi gerçekten çok iyi. Kesinlikle tekrar alışveriş yapacağım.",
  },
  {
    name: "Derya T.",
    city: "Ankara",
    rating: 5,
    quote: "Büyük beden şıklığına modern bir dokunuş. Beden rehberi çok yardımcı oldu.",
  },
  {
    name: "Gizem U.",
    city: "Bursa",
    rating: 5,
    quote: "Ürün görseldekiyle birebir, kaliteli ve rahat. Tavsiye ederim!",
  },
]

function Stars({ value = 5 }) {
  return <div className="t-stars">{"★".repeat(value)}{"☆".repeat(5 - value)}</div>
}

export default function TestimonialsSection() {
  const ref = useRef(null)

  useEffect(() => {
    // otomatik kaydırma
    const el = ref.current
    let index = 0
    const timer = setInterval(() => {
      if (!el) return
      index = (index + 1) % TESTIMONIALS.length
      el.scrollTo({
        left: index * el.clientWidth,
        behavior: "smooth",
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="tij-slider container">
      <div className="t-head">
        <h2>Müşteri Yorumları</h2>
        <p>tiajoven müşterilerinden gerçek deneyimler</p>
      </div>

      <div className="t-track" ref={ref}>
        {TESTIMONIALS.map((t, i) => (
          <article key={i} className="t-card">
            <div className="t-user">
              <div>
                <h4>{t.name}</h4>
                <small>{t.city}</small>
              </div>
            </div>
            <Stars value={t.rating} />
            <p className="t-quote">“{t.quote}”</p>
          </article>
        ))}
      </div>
    </section>
  )
}