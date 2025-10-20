import { create } from "zustand"
import { api } from "../lib/api"

export const useFavorites = create((set, get) => ({
  items: [],
  loading: false,

 fetchFavorites: async () => {
  set({ loading: true })
  try {
    const { data } = await api.get("/favorites")
    const items =
      Array.isArray(data)
        ? data.map(x => (typeof x === "number" ? x : (x.productId ?? x.id)))
        : []
    set({ items, loading: false })
  } catch {
    set({ loading: false })
  }
},

  toggleFavorite: async (productId) => {
    try {
      const { data } = await api.post(`/favorites/${productId}`)
      const current = get().items
      set({
        items: data.favorite
          ? [...current, productId]
          : current.filter((id) => id !== productId),
      })
    } catch (err) {
      console.error(err)
    }
  },
}))
