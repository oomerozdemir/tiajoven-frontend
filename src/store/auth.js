import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "../lib/api"

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password })
        set({ token: data.token, user: data.user })
        return data
      },

      logout: () => {
        set({ user: null, token: null })
      },

      setAuth: (user, token) => set({ user, token }),
    }),
    {
      name: "auth", 
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
