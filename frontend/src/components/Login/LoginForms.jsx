'use client'

import {
  UserPlus,
  LogIn,
  User,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";



export default function LoginForms({
  email,
  senha,
  setEmail,
  setSenha,
  msgErro,
  msgSucesso,
  mostrarSenha,
  setMostrarSenha,
  entrar,
}) {

  return (
     <main className="flex items-center justify-center min-h-screen bg-linear-to-r from-slate-100 via-blue-100 to-slate-800 px-4 py-10">

    {/* Card Principal */}
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-6xl grid md:grid-cols-2">

      {/* Lado esquerdo */}
      <div className="hidden md:flex flex-col justify-center items-center bg-blue-700 text-white p-10 relative">

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Conteúdo */}
        <div className="relative z-10 text-center">

          <div className="text-7xl mb-6">
            💈
          </div>

          <h1 className="text-5xl font-bold mb-4">
            BarberSpace
          </h1>

          <div className="w-24 h-1 bg-white rounded-full mx-auto mb-8"></div>

          <h2 className="text-3xl font-semibold mb-4">
            Bem-vindo de volta
          </h2>

          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            Entre na plataforma e gerencie seus agendamentos de forma fácil e rápida.
          </p>

        </div>
      </div>

      {/* Lado direito */}
      <div className="p-6 sm:p-10 flex flex-col justify-center">

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Entrar
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Acesse sua conta para continuar
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

        {/* Email */}
        <div className="mb-4">

          <label className="block text-sm font-medium mb-2 text-gray-700">
            Email
          </label>

          <div className="relative">

            {/* Ícone */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              📧
            </div>

            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full border border-gray-300 rounded-xl p-3 pl-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

          </div>
        </div>

        {/* Senha */}
        <div className="mb-2">

          <label className="block text-sm font-medium mb-2 text-gray-700">
            Senha
          </label>

          <div className="relative">

            {/* Ícone */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔒
            </div>

            <input
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full border border-gray-300 rounded-xl p-3 pl-12 pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {/* Mostrar senha */}
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
            >
              {mostrarSenha ? "🙈" : "👁"}
            </button>

          </div>
        </div>

        {/* Extras */}
        <div className="flex items-center justify-between mb-6 mt-2">

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">

            <input
              type="checkbox"
              className="accent-blue-600"
            />

            Lembrar de mim

          </label>

          <a
            href="#"
            className="text-sm text-blue-600 hover:underline"
          >
            Esqueceu a senha?
          </a>

        </div>

        {/* Botão */}
        <button
          onClick={entrar}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-xl text-sm sm:text-base font-medium transition duration-200 shadow-lg"
        >
          Entrar
        </button>

        {/* Divisor */}
        <div className="flex items-center gap-4 my-6">

          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="text-sm text-gray-400">
            OU
          </span>

          <div className="flex-1 h-px bg-gray-300"></div>

        </div>

        {/* Google */}
        <button
          className="w-full border border-gray-300 hover:bg-gray-100 py-3 rounded-xl flex items-center justify-center gap-3 transition"
        >

          <span className="text-xl">
            🔵
          </span>

          Entrar com Google

        </button>

        {/* Cadastro */}
        <p className="text-center mt-6 text-sm sm:text-base text-gray-600">

          Não possui conta?{" "}

          <a
            href="/cadastro"
            className="text-blue-700 font-semibold hover:underline"
          >
            Criar conta
          </a>

        </p>

      </div>
    </div>
  </main>
  );
}
