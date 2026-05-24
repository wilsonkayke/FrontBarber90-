"use client";

import { CalendarDays, Clock3, CheckCircle2, Scissors } from "lucide-react";

export default function AgendaForm({
  data,
  setData,
  horarios = [],
  horarioSelecionado,
  setHorarioSelecionado,
  msgErro,
  msgSucesso,
  handleAgendar,
}) {
  return (
    <main
      style={{
        backgroundImage: "url('/imagens/principal.jpg')",
      }}
      className="
    bg-transparent
    opacity-97
    bg-cover
    bg-center
    bg-no-repeat
    min-h-screen
    flex
    items-center
    justify-center
    px-4
    py-4
  "
    >
      {/* Container */}
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl grid md:grid-cols-2">
        {/* LADO ESQUERDO */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-700 text-white p-10 relative">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Conteúdo */}
          <div className="relative z-10 text-center">
            {/* Ícone */}
            <div className="bg-white/20 w-28 h-28 rounded-full flex items-center justify-center mb-8 mx-auto backdrop-blur-sm">
              <Scissors size={55} />
            </div>

            {/* Logo */}
            <h1 className="text-5xl font-bold mb-4">BarberSpace</h1>

            <div className="w-24 h-1 bg-white rounded-full mx-auto mb-8"></div>

            {/* Texto */}
            <h2 className="text-3xl font-semibold mb-4">Agende seu horário</h2>

            <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
              Escolha a melhor data e horário para seu atendimento de forma
              rápida e moderna.
            </p>

            {/* Cards */}
            <div className="mt-10 space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h3 className="font-semibold mb-1">Atendimento</h3>

                <p className="text-sm text-blue-100">Quarta à sábado</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h3 className="font-semibold mb-1">Funcionamento</h3>

                <p className="text-sm text-blue-100">08:00 às 18:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="p-5 sm:p-6 flex flex-col justify-center">
          {/* Título */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Agendamento
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Escolha uma data e um horário disponível
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

          {/* FORM */}
          <form onSubmit={handleAgendar} className="space-y-6">
            {/* DATA */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Data do Agendamento
              </label>

              <div className="relative">
                {/* <CalendarDays
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />*/}

                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 pl-12 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* HORÁRIOS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Horários Disponíveis
                </label>

                <span className="text-sm text-blue-600 font-medium">
                  {horarios.filter((item) => !item.ocupado).length} disponíveis
                </span>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-3 gap-2 max-h-62.5 overflow-y-auto pr-2">
                {horarios.map((item) => (
                  <button
                    key={item.hora}
                    type="button"
                    disabled={item.ocupado}
                    onClick={() =>
                      !item.ocupado && setHorarioSelecionado(item.hora)
                    }
                    className={`
    p-2 rounded-xl transition duration-200
    flex flex-col items-center justify-center
    min-h-20

    ${
      item.ocupado
        ? "bg-red-100 text-red-500 cursor-not-allowed"
        : horarioSelecionado === item.hora
          ? "bg-blue-700 text-white scale-105 shadow-lg"
          : "bg-blue-600 hover:bg-blue-900 text-white"
    }
  `}
                  >
                    {/* HORÁRIO */}
                    <span className="font-bold text-lg">{item.hora}</span>

                    {/* STATUS */}
                    <span className="text-xs mt-1 opacity-90">
                      {item.ocupado ? "Ocupado" : "Disponível"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* COMO FUNCIONA */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-blue-600 mt-1" size={20} />

                <div>
                  <h3 className="font-semibold text-blue-700 mb-1">
                    Como funciona?
                  </h3>

                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Escolha uma data disponível</li>

                    <li>• Selecione um horário livre</li>

                    <li>• Confirme seu agendamento</li>

                    <li>• Aguarde seu atendimento</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white py-3 rounded-xl font-semibold transition duration-200 shadow-lg"
            >
              Confirmar Agendamento
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
