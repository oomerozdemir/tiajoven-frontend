import { useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"
import "../styles/auth.css"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")  // 🆕 eklendi
  const [isEmailAllowed, setIsEmailAllowed] = useState(false)
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg({ type: "", text: "" })

    // 🧠 Şifre eşleşme kontrolü
    if (password !== confirmPassword) {
      setMsg({ type: "error", text: "Şifreler eşleşmiyor." })
      return
    }

    if (password.length < 6) {
      setMsg({ type: "error", text: "Şifre en az 6 karakter olmalı." })
      return
    }

    setLoading(true)
    try {
      await api.post("/auth/register", { email, password, isEmailAllowed })
      setMsg({ type: "ok", text: "Kayıt başarılı. Giriş yapabilirsiniz." })
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setIsEmailAllowed(false)
    } catch (err) {
      const text = err.response?.data?.message || "Bir hata oluştu."
      setMsg({ type: "error", text })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-head">
          <h1 className="auth-title">Kayıt Ol</h1>
          <p className="auth-sub">tiajoven’e hoş geldiniz</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label" htmlFor="email">E-posta</label>
          <input
            id="email"
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@mail.com"
            required
          />

          <label className="auth-label" htmlFor="password">Şifre</label>
          <input
            id="password"
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
          />

          {/* 🆕 Şifre tekrarı alanı */}
          <label className="auth-label" htmlFor="confirmPassword">Şifre Tekrarı</label>
          <input
            id="confirmPassword"
            className="auth-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••"
            required
          />

          <label className="auth-check">
            <input
              type="checkbox"
              checked={isEmailAllowed}
              onChange={(e) => setIsEmailAllowed(e.target.checked)}
            />
            E-posta ile kampanya ve bilgilendirme almayı kabul ediyorum.
          </label>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Kayıt Ol"}
          </button>

          {msg.text && (
            <div className={`auth-msg ${msg.type === "error" ? "error" : "ok"}`}>
              {msg.text}
            </div>
          )}
        </form>

        <div className="auth-foot">
          Hesabın var mı? <Link to="/login">Giriş yap</Link>
        </div>
      </div>
    </div>
  )
}
