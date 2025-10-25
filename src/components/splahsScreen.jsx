import React, { useEffect, useState, useCallback } from "react";
import "../styles/splash.css";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  const close = useCallback(() => {
    setVisible(false);
    // scroll kilidini hemen kaldır
    document.body.classList.remove("no-scroll");
  }, []);

  // zamanlayıcı + ESC
  useEffect(() => {
    const t = setTimeout(close, 2200);
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [close]);

  // 🔑 asıl düzeltme: visible'a bağlı olarak no-scroll'u yönet
  useEffect(() => {
    document.body.classList.toggle("no-scroll", visible);
    return () => document.body.classList.remove("no-scroll");
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="splash-container"
      role="dialog"
      aria-label="Tiajoven açılış"
      aria-modal="true"
      onClick={close}
    >
      <div className="splash-bg" aria-hidden="true" />
      <h1 className="splash-logo">TIAJOVEN</h1>
    </div>
  );
}
