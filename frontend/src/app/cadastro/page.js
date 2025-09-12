"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [msgErro, setMsgErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const validarFormulario = () => {
    if (nome.length < 3) {
      setMsgErro("Nome deve ter pelo menos 3 caracteres.");
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

  const cadastrar = () => {
    if (!validarFormulario()) return;

    let listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");

    listaUser.push({
      nomeCadas: nome,
      usuaCadas: usuario,
      senhaCadas: senha,
    });

    localStorage.setItem("listaUser", JSON.stringify(listaUser));

    setMsgSucesso("Cadastro feito com sucesso!");
    setMsgErro("");

    // Redireciona para login
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Cadastrar</h1>

        {msgErro && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{msgErro}</div>
        )}
        {msgSucesso && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 rounded">
            {msgSucesso}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Usuário</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4 relative">
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

        <div className="mb-6 relative">
          <label className="block text-sm font-medium">Confirmar Senha</label>
          <input
            type={mostrarConfirmarSenha ? "text" : "password"}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full border rounded p-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            className="absolute right-2 top-8 text-gray-500"
          >
            👁
          </button>
        </div>

        <button
          onClick={cadastrar}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </div>
    </main>
  );
}
