import "../styles/brandsSection.css"

const BRANDS = [
  { name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
  { name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
  { name: "Mango", logo: "https://upload.wikimedia.org/wikipedia/commons/3/32/Mango_logo.svg" },
  { name: "LC Waikiki", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2b/LC_Waikiki_logo.svg" },
  { name: "Koton", logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/Koton_logo.svg" },
]

export default function BrandsSection(){
  return (
    <section className="brands container">
      <h2 className="brands-title">Çalıştığımız Markalar</h2>
      <p className="brands-sub">Kalite ve tarzı bir araya getiren seçkin markalar</p>

      <div className="brands-grid">
        {BRANDS.map((b, i) => (
          <div key={i} className="brand-card">
            <img src={b.logo} alt={b.name} />
          </div>
        ))}
      </div>
    </section>
  )
}
