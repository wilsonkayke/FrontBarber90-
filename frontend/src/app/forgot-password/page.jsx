"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  const enviar = async () => {
    setMsg("");
    setErro("");

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.detail || "Erro ao enviar e-mail");
        return;
      }

      setMsg(data.msg);

    } catch (err) {
      setErro("Erro de conexão");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Recuperar senha</h2>

      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={enviar}>
        Enviar link
      </button>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}