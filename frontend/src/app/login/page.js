"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

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
        if (data.user.role === "admin") {
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
  <main className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-100 to-gray-300 px-4">
    
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md">
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        Entrar
      </h1>

      {msgErro && (
        <div className="bg-red-100 text-red-600 p-2 sm:p-3 mb-4 rounded-lg text-center text-sm">
          {msgErro}
        </div>
      )}

      {msgSucesso && (
        <div className="bg-green-100 text-green-600 p-2 sm:p-3 mb-4 rounded-lg text-center text-sm">
          {msgSucesso}
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Senha */}
      <div className="mb-6 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>

        <input
          type={mostrarSenha ? "text" : "password"}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          className="w-full border border-gray-300 rounded-lg p-2.5 pr-11 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          type="button"
          onClick={() => setMostrarSenha(!mostrarSenha)}
          className="absolute right-3 top-9.5 text-gray-500 hover:text-gray-700"
        >
          {mostrarSenha ? "🙈" : "👁"}
        </button>
      </div>

      {/* Botão */}
      <button
        onClick={entrar}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm sm:text-base hover:bg-blue-700 active:scale-95 transition"
      >
        Entrar
      </button>

      {/* Link */}
      <div className="text-center mt-4">
        <a
          href="/cadastro"
          className="text-blue-600 hover:underline font-medium text-sm sm:text-base"
        >
          Cadastrar-se
        </a>
      </div>
    </div>
  </main>
  );
} 
