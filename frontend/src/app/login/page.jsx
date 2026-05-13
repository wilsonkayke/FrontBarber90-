"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForms from "../../components/Login/LoginForms";



const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [msgErro, setMsgErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const entrar = async () => {
    setMsgErro("");
    setMsgSucesso("");

    try {
      const response = await fetch(
        "https://barber-edxf.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const erros = data.detail.map((err) => err.msg).join(", ");
          setMsgErro(erros);
        } else {
          setMsgErro(data.detail || "Email ou senha inválidos");
        }
        return;
      }

      // 🔐 salva dados
      localStorage.clear();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      setMsgSucesso("Login realizado com sucesso!");

      setTimeout(() => {
        if (data.user.role?.trim().toLowerCase() === "admin") {
          router.push("/admin");
        } else {
          router.push("/agenda");
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      setMsgErro("Erro ao conectar com o servidor");
    }
  };

  return (
    <LoginForms 
    email={email}
    senha={senha}
    setEmail={setEmail}
    setSenha={setSenha}
    
    />
  )
    
}
