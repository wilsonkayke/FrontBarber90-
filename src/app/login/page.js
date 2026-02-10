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

    let userValid = listaUser.find(
      (item) => usuario === item.usuaCadas && senha === item.senhaCadas
    );

    if (userValid) {
      setMsgSucesso("Usuário autenticado com sucesso!");
      setMsgErro("");

      setTimeout(() => {
        router.push("/agenda"); // vai para agenda após login
      }, 1500);
    } else {
      setMsgErro("Usuário ou senha inválidos!");
      setMsgSucesso("");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Entrar</h1>

        {msgErro && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{msgErro}</div>
        )}
        {msgSucesso && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 rounded">
            {msgSucesso}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-sm font-medium">Senha</label>
          <input
            type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border rounded p-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-2 top-8 text-gray-500"
          >
            👁
          </button>
        </div>

        <button
          onClick={entrar}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>

        <div className="text-center mt-4">
          <a href="/cadastro" className="text-blue-600 hover:underline">
            Cadastrar-se
          </a>
        </div>
      </div>
    </main>
  );
}
