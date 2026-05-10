"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

    if (senha.length > 72) {
      setMsgErro("Senha muito longa.");
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
      const response = await fetch(
        "https://barber-edxf.onrender.com/clientes/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            usuario,
            senha,
            confirmar_senha: confirmarSenha,
          }),
        },
      );

      const text = await response.text();

      console.log("STATUS:", response.status);
      console.log("RAW RESPONSE:", text);

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (jsonError) {
        console.error("Erro ao converter JSON:", jsonError);
      }

      if (!response.ok) {
        setMsgErro(data.detail || "Erro ao cadastrar");
        setMsgSucesso("");
        return;
      }

      setMsgSucesso("Cadastro feito com sucesso!");
      setMsgErro("");

      setTimeout(() => {
        router.push("/agenda");
      }, 1500);
    } catch (error) {
      console.error("ERRO COMPLETO:", error);

      if (error instanceof Error) {
        setMsgErro(error.message);
      } else {
        setMsgErro("Erro desconhecido");
      }
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-linear-to-r from-blue-100 to-gray-800 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md md:max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Cadastrar
        </h1>

        {msgErro && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-lg text-sm text-center">
            {msgErro}
          </div>
        )}

        {msgSucesso && (
          <div className="bg-green-100 text-green-600 p-3 mb-4 rounded-lg text-sm text-center">
            {msgSucesso}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>

          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
          />
        </div>

        {/* Usuário */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Usuário
          </label>

          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
          />
        </div>

        {/* Senha */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Senha
          </label>

          <input
            type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 pr-12 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
          />

          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            👁
          </button>
        </div>

        {/* Confirmar senha */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Confirmar Senha
          </label>

          <input
            type={mostrarConfirmarSenha ? "text" : "password"}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 pr-12 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
          />

          <button
            type="button"
            onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            👁
          </button>
        </div>

        {/* Botão */}
        <button
          onClick={cadastrar}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm sm:text-base hover:bg-blue-700 active:scale-95 transition"
        >
          Cadastrar-se
        </button>
      </div>
    </main>
  );
}
