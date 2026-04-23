"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [msgErro, setMsgErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const validarFormulario = () => {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regexEmail.test(email)) {
    setMsgErro("Email inválido.");
    return false;
    }
    if (usuario.length < 5) {
      setMsgErro("Usuário deve ter pelo menos 5 caracteres.");
      return false;
    }
    if (senha.length < 6) {
      setMsgErro("Senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (senha !== confirmarSenha) {
      setMsgErro("As senhas não conferem.");
      return false;
    }
    setMsgErro("");
    return true;
  };

  const cadastrar = async () => {
  if (!validarFormulario()) return;

  try {

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${API_URL}/clientes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        usuario,
        senha,
        confirmar_senha: senha,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMsgErro(data.detail || "Erro ao cadastrar");
      return;
    }

    setMsgSucesso("Cadastro feito com sucesso!");
    setMsgErro("");
    
    setTimeout(() => {
      router.push("/agenda");
    }, 1500);
  } catch (error) {
    setMsgErro("Erro de conexão com o servidor");
  }
};


  return (
    <main className="flex items-center justify-center min-h-screen bg-linear-to-r from-blue-100 to-gray-800">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Cadastrar
        </h1>

        {msgErro && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
            {msgErro}
          </div>
        )}

        {msgSucesso && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 rounded text-sm">
            {msgSucesso}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Usuario */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Usuário</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Senha */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border rounded-lg p-2.5 pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-9 text-gray-500"
          >
            👁
          </button>
        </div>

        {/* Confirmar senha */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-1">
            Confirmar Senha
          </label>
          <input
            type={mostrarConfirmarSenha ? "text" : "password"}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full border rounded-lg p-2.5 pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={() =>
              setMostrarConfirmarSenha(!mostrarConfirmarSenha)
            }
            className="absolute right-3 top-9 text-gray-500"
          >
            👁
          </button>
        </div>

        <button
          onClick={cadastrar}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm sm:text-base hover:bg-blue-700 transition"
        >
          Cadastrar-se
        </button>
      </div>
    </main>
  );
}
