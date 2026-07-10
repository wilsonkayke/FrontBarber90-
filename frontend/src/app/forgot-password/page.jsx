"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column", // Empilha a imagem e a caixa verticalmente
        alignItems: "center", // Centraliza horizontalmente tanto a imagem quanto a caixa
        justifyContent: "center", // Centraliza verticalmente o conjunto todo
        gap: "20px", // Espaço entre a imagem e a caixa de recuperar senha
        padding: "20px",
      }}
    >
      {/* 2. Sua Imagem */}
      <img
        src="./imagens/barberFlowRedondo.png" // Substitua pelo caminho da sua imagem ou logo
        alt="Logo do sistema"
        style={{
          maxWidth: "150px", // Controla a largura máxima da imagem
          height: "auto", // Mantém a proporção da imagem sem distorcer
          borderRadius: "8px", // Opcional: arredonda os cantos da própria imagem se necessário
        }}
      />

      {/* 3. Sua caixa de recuperar senha */}
      <div
        style={{
          backgroundColor: "#1e293b",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
        }}
      >
        <h2 style={{ textAlign: "center", margin: 0 }}>Recuperar senha</h2>

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #475569",
            backgroundColor: "#334155",
            color: "#ffffff",
          }}
        />

        <button
          onClick={enviar}
          className="py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors font-medium"
        >
          Enviar link
        </button>

        <button className="px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded transition-colors">
          <a
            href="/login"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            Voltar
          </a>
        </button>

        {msg && (
          <p style={{ color: "#4ade80", textAlign: "center", margin: 0 }}>
            {msg}
          </p>
        )}
        {erro && (
          <p style={{ color: "#f87171", textAlign: "center", margin: 0 }}>
            {erro}
          </p>
        )}
      </div>
    </div>
  );
}
