import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import { useAuth } from "../store/auth"   
import "../styles/auth.css"

export default function Login(){
  const navigate = useNavigate()
  const login = useAuth((s)=>s.login)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg({ type: "", text: "" })
    setLoading(true)
    try{

      await login(email, password) // <-- store hallediyor:contentReference[oaicite:6]{index=6}

      setMsg({ type: "ok", text: "Giriş başarılı." })
      navigate("/") // anasayfaya yönlendir
    }catch(err){
      const text = err.response?.data?.message || "Geçersiz e-posta veya şifre."
      setMsg({ type: "error", text })
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-head">
          <h1 className="auth-title">Giriş Yap</h1>
          <p className="auth-sub">Hesabınıza erişin</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label" htmlFor="email">E-posta</label>
          <input
            id="email"
            className="auth-input"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="ornek@mail.com"
            required
          />

          <label className="auth-label" htmlFor="password">Şifre</label>
          <input
            id="password"
            className="auth-input"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="••••••"
            minLength={6}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
          </button>

          {msg.text && (
            <div className={`auth-msg ${msg.type === "error" ? "error" : "ok"}`}>
              {msg.text}
            </div>
          )}
        </form>

        <div className="auth-foot">
          Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
        </div>
      </div>
    </div>
  )
}
