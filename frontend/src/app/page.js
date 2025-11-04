"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const [msgErro, setMsgErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const entrar = () => {
  let listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");

  // 🔐 Admin fixo
  if (usuario === "admin" && senha === "1234") {
    setMsgSucesso("Bem-vindo, administrador!");
    setMsgErro("");

    setTimeout(() => {
      router.push("/admin"); // vai para tela de admin
    }, 1500);
    return; // impede continuar o código
  }

  let userValid = listaUser.find(
    (item) => usuario === item.usuaCadas && senha === item.senhaCadas
  );

  if (userValid) {
    setMsgSucesso("Usuário autenticado com sucesso!");
    setMsgErro("");

    setTimeout(() => {
      router.push("/agenda"); // vai para agenda após login normal
    }, 1500);
  } else {
    setMsgErro("Usuário ou senha inválidos!");
    setMsgSucesso("");
  }
};


  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Entrar
        </h1>

        {msgErro && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-lg text-center">
            {msgErro}
          </div>
        )}
        {msgSucesso && (
          <div className="bg-green-100 text-green-600 p-3 mb-4 rounded-lg text-center">
            {msgSucesso}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Usuário
          </label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Digite seu usuário"
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Digite sua senha"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
          >
            {mostrarSenha ? "🙈" : "👁"}
          </button>
        </div>

        <button
          onClick={entrar}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition"
        >
          Entrar
        </button>

        <div className="text-center mt-4">
          <a
            href="/cadastro"
            className="text-blue-600 hover:underline font-medium"
          >
            Cadastrar-se
          </a>
        </div>
      </div>
    </main>
  );
}
