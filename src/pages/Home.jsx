import HeroSection from "../components/heroSection"
import CategorySection from "../components/categorySection"
import FeaturedProducts from "../components/featuredProducts"
import BrandsSection from "../components/brandsSection"
import TestimonialsSection from "../components/testimonialsSection"

export default function Home(){
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />

      <CategorySection />
      {//<BrandsSection /><TestimonialsSection />
      }



    </div>
  )
}
