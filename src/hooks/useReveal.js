import { useEffect } from "react"

export default function useReveal(selector = ".reveal") {
  useEffect(() => {
    const els = document.querySelectorAll(selector)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal--in")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [selector])
}
