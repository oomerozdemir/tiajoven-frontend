import axios from "axios";

// .env içindeki URL'yi al, yoksa uygun fallback ayarla
const BASE =
  (import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://tiajoven-backend.onrender.com")
  ).replace(/\/+$/, ""); // sondaki /'ları temizler

export const api = axios.create({
  baseURL: `${BASE}/api`,
});

// İstek öncesi token ekleme
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Yanıt kontrolü
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem("auth");
      } catch {}
      // window.location.assign("/login") // opsiyonel yönlendirme
    }
    return Promise.reject(err);
  }
);
