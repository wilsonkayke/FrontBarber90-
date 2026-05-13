"use client";

import {
  UserPlus,
  LogIn,
  User,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

export default function CadastroUI({
  email,
  setEmail,
  usuario,
  setUsuario,
  senha,
  setSenha,
  confirmarSenha,
  setConfirmarSenha,
  mostrarSenha,
  setMostrarSenha,
  mostrarConfirmarSenha,
  setMostrarConfirmarSenha,
  msgErro,
  msgSucesso,
  cadastrar,
}) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-linear-to-r from-blue-100 to-gray-800 px-4 py-10">

      {/* Card */}
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-6xl grid md:grid-cols-2">

        {/* Lado esquerdo */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-700 text-white p-10 relative">

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Conteúdo */}
          <div className="relative z-10 text-center">

            <div className="text-6xl mb-6">
              💈
            </div>

            <h1 className="text-5xl font-bold mb-4">
              BarberSpace
            </h1>

            <div className="w-20 h-1 bg-white mx-auto rounded-full mb-8"></div>

            <h2 className="text-3xl font-semibold mb-4">
              Faça parte da nossa equipe
            </h2>

            <p className="text-lg text-blue-100 leading-relaxed max-w-sm">
              Crie sua conta e gerencie agendamentos e muito mais.
            </p>

          </div>
        </div>

        {/* Lado direito */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Cadastrar
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Preencha os dados abaixo para criar sua conta
          </p>

          {/* Mensagem erro */}
          {msgErro && (
            <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-xl text-sm text-center">
              {msgErro}
            </div>
          )}

          {/* Mensagem sucesso */}
          {msgSucesso && (
            <div className="bg-green-100 text-green-600 p-3 mb-4 rounded-xl text-sm text-center">
              {msgSucesso}
            </div>
          )}

          {/* Nome */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Nome completo
            </label>

            <div className="relative">

              <User
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full border border-gray-300 rounded-xl p-3 pl-12 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

            </div>
          </div>

          {/* Email */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>

            <div className="relative">

              <LogIn
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="w-full border border-gray-300 rounded-xl p-3 pl-12 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

            </div>
          </div>

          {/* Senha */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Senha
            </label>

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full border border-gray-300 rounded-xl p-3 pl-12 pr-12 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
              >
                {mostrarSenha ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
          </div>

          {/* Confirmar senha */}
          <div className="mb-6">

            <label className="block text-sm font-medium mb-2 text-gray-700">
              Confirmar senha
            </label>

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={
                  mostrarConfirmarSenha
                    ? "text"
                    : "password"
                }
                value={confirmarSenha}
                onChange={(e) =>
                  setConfirmarSenha(e.target.value)
                }
                placeholder="Confirme sua senha"
                className="w-full border border-gray-300 rounded-xl p-3 pl-12 pr-12 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarConfirmarSenha(
                    !mostrarConfirmarSenha
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
              >
                {mostrarConfirmarSenha ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
          </div>

          {/* Botão */}
          <button
            onClick={cadastrar}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-lg"
          >

            <UserPlus size={20} />

            Cadastrar

          </button>

          {/* Login */}
          <p className="text-center mt-6 text-sm sm:text-base text-gray-600">

            Já tem uma conta?{" "}

            <a
              href="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Entrar
            </a>

          </p>

        </div>
      </div>
    </main>
  );
}