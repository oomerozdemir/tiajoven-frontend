import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
})

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth") // persist key’in:contentReference[oaicite:10]{index=10}
    if (raw) {
      const parsed = JSON.parse(raw)
      const token = parsed?.state?.token
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  } catch {}
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401 || status === 403) {
      try {
        // Persist edilen state’i da temizle
        localStorage.removeItem("auth")
      } catch {}
      // İsteğe bağlı: window.location.assign("/login")
    }
    return Promise.reject(err)
  })