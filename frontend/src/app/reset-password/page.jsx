"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  const handleReset = async () => {
    setErro("");
    setMsg("");

    if (!token) {
      setErro("Token inválido");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          nova_senha: novaSenha,
          confirmar_senha: confirmarSenha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.detail || "Erro ao redefinir senha");
        return;
      }

      setMsg("Senha alterada com sucesso!");

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com servidor");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Redefinir senha</h2>

      <input
        type="password"
        placeholder="Nova senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
      />

      <button onClick={handleReset}>
        Alterar senha
      </button>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}
    </div>
  );
}