import HeroSection from "../components/heroSection"
import CategorySection from "../components/categorySection"
import FeaturedProducts from "../components/featuredProducts"
import BrandsSection from "../components/brandsSection"
import TestimonialsSection from "../components/testimonialsSection"
import SEO from "../components/seo"

export default function Home(){
   const origin = typeof window !== "undefined" ? window.location.origin : "https://www.tiajoven.com";
  const pageUrl = origin + "/";
  const pageTitle = "Tiajoven | Büyük Beden Kadın Giyim & Toptan Koleksiyon";
  const pageDescription =
    "Tiajoven, modern ve zarif büyük beden kadın giyim markasıdır. Toptan koleksiyonları Türkiye’nin 66 ilindeki mağazalara ulaştırır.";
  const ogImage = origin + "/images/og-home.jpg";

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Tiajoven Tekstil",
      url: origin,
      logo: origin + "/images/logo.svg",
      sameAs: [
        "https://www.instagram.com/tiajoven",
        "https://www.facebook.com/tiajoven"
      ],
      contactPoint: [{
        "@type": "ContactPoint",
        telephone: "+90 533 777 47 71",
        contactType: "customer service",
        areaServed: "TR",
        availableLanguage: ["tr"]
      }]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Tiajoven",
      url: origin
    }
  ];
  return (
    <div>
       <SEO
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        image={ogImage}
        type="website"
        structuredData={structuredData}
      />
      <HeroSection />
      <FeaturedProducts />

      <CategorySection />
      {//<BrandsSection /><TestimonialsSection />
      }



    </div>
  )
}
