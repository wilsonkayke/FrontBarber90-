"use client";

import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Scissors,
} from "lucide-react";

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
    <main className="flex items-center justify-center min-h-screen bg-linear-to-r from-slate-100 via-blue-100 to-slate-800 px-4 py-10">

      {/* Container */}
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-6xl grid md:grid-cols-2">

        {/* Lado esquerdo */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-700 text-white p-10 relative">

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Conteúdo */}
          <div className="relative z-10 text-center">

            <div className="bg-white/20 w-28 h-28 rounded-full flex items-center justify-center mb-8 mx-auto backdrop-blur-sm">

              <Scissors size={55} />

            </div>

            <h1 className="text-5xl font-bold mb-4">
              BarberShop
            </h1>

            <div className="w-24 h-1 bg-white rounded-full mx-auto mb-8"></div>

            <h2 className="text-3xl font-semibold mb-4">
              Agende seu horário
            </h2>

            <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
              Escolha a melhor data e horário
              para seu atendimento de forma
              rápida e moderna.
            </p>

            {/* Cards informativos */}
            <div className="mt-10 space-y-4">

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">

                <h3 className="font-semibold mb-1">
                  Atendimento
                </h3>

                <p className="text-sm text-blue-100">
                  Quarta à sábado
                </p>

              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">

                <h3 className="font-semibold mb-1">
                  Funcionamento
                </h3>

                <p className="text-sm text-blue-100">
                  08:00 às 18:00
                </p>

              </div>

            </div>

          </div>
        </div>

        {/* Lado direito */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Agendamento
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Escolha uma data e um horário disponível
          </p>

          {/* Mensagens */}
          {msgErro && (
            <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-xl text-sm text-center">
              {msgErro}
            </div>
          )}

          {msgSucesso && (
            <div className="bg-green-100 text-green-600 p-3 mb-4 rounded-xl text-sm text-center">
              {msgSucesso}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleAgendar}
            className="space-y-6"
          >

            {/* Data */}
            <div>

              <label className="block text-sm font-medium mb-2 text-gray-700">
                Data do Agendamento
              </label>

              <div className="relative">

                <CalendarDays
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 pl-12 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none transition"
                />

              </div>

            </div>

            {/* Horários */}
            <div>

              <div className="flex items-center justify-between mb-3">

                <label className="text-sm font-medium text-gray-700">
                  Horários Disponíveis
                </label>

                <div className="text-sm text-blue-600 font-medium">
                  {horarios.length} disponíveis
                </div>

              </div>

              {/* Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">

                {horarios.map((horario, index) => {

                  const selecionado =
                    horarioSelecionado === horario;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setHorarioSelecionado(horario)
                      }
                      className={`p-3 rounded-xl border text-sm font-medium transition duration-200 flex items-center justify-center gap-2
                        
                        ${
                          selecionado
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                            : "bg-white hover:bg-blue-50 border-gray-300 text-gray-700"
                        }
                      `}
                    >

                      <Clock3 size={16} />

                      {horario}

                    </button>
                  );
                })}

              </div>

            </div>

            {/* Informações */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">

              <div className="flex items-start gap-3">

                <CheckCircle2
                  className="text-blue-600 mt-1"
                  size={20}
                />

                <div>

                  <h3 className="font-semibold text-blue-700 mb-1">
                    Como funciona?
                  </h3>

                  <ul className="text-sm text-blue-700 space-y-1">

                    <li>
                      • Escolha uma data disponível
                    </li>

                    <li>
                      • Selecione um horário livre
                    </li>

                    <li>
                      • Confirme seu agendamento
                    </li>

                    <li>
                      • Aguarde seu atendimento
                    </li>

                  </ul>

                </div>

              </div>

            </div>

            {/* Botão */}
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