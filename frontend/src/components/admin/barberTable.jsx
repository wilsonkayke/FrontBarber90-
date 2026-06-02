"use client";

import { useState } from "react";

export default function BarberTable({
  data = [],
  onChamar,
  onFinalizar,
  diaSelecionado,
  setDiaSelecionado,
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 mb-4">
        {/* Div 1 */}
        <div
          onClick={() => setDiaSelecionado("hoje")}
          className={`
      cursor-pointer
      p-4
      rounded-2xl
      w-35
      text-center
      font-bold
      transition
      ${
        diaSelecionado === "hoje"
          ? "bg-blue-600 text-white"
          : "bg-slate-200 text-gray-700"
      }
    `}
        >
          Hoje
        </div>

        <div
          onClick={() => setDiaSelecionado("amanha")}
          className={`
      cursor-pointer
      p-4
      rounded-2xl
      w-35
      text-center
      font-bold
      transition
      ${
        diaSelecionado === "amanha"
          ? "bg-blue-600 text-white"
          : "bg-slate-200 text-gray-700"
      }
    `}
        >
          Amanhã
        </div>

        <div
          onClick={() => setDiaSelecionado("proximos")}
          className={`
      cursor-pointer
      p-4
      rounded-2xl
      w-35
      text-center
      font-bold
      transition
      ${
        diaSelecionado === "proximos"
          ? "bg-blue-600 text-white"
          : "bg-slate-200 text-gray-700"
      }
    `}
        >
          Próximos
        </div>

        <div
          onClick={() => setDiaSelecionado("Todos")}
          className={`
      cursor-pointer
      p-4
      rounded-2xl
      w-35
      text-center
      font-bold
      transition
      ${
        diaSelecionado === "Todos"
          ? "bg-blue-600 text-white"
          : "bg-slate-200 text-gray-700"
      }
    `}
        >
          Todos
        </div>
      </div>

      {/* <p className="text-center text-white bg-blue-500 font-bold rounded-md py-3 w-35">Hoje</p> */}

      <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden mt-02">
        <thead>
          <tr className="bg-slate-300 text-left text-gray-700">
            <th className="py-4 px-4">#</th>
            <th>Nome</th>
            <th>Horário</th>
            <th className="pr-4 px-14">Ações</th> 
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((cliente, index) => (
              <tr
                key={cliente._id}
                className="border-b last:border-none hover:bg-slate-50 transition"
              >
                <td className="py-4 px-4 font-medium">{index + 1}</td>

                <td className="font-medium text-gray-700">{cliente.nome}</td>

                <td className="text-gray-600">
                  {new Date(cliente.horario + "Z").toLocaleTimeString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="flex gap-2 py-3 pr-4">
                  {/* Chamar */} 
                  <button
                    onClick={onChamar}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-4 py-2 rounded-lg transition"
                  >
                    Chamar
                  </button>

                  {/* Finalizar */}
                  <button
                    onClick={onFinalizar}
                    className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-medium px-4 py-2 rounded-lg transition"
                  >
                    Finalizar
                  </button> 
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500">
                Nenhum agendamento pendente
              </td>
            </tr>
          )}
        </tbody>
      </table> 
 
      {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        { CARD 1: Próximos dias }
        <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
          { Título }
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <span>📅</span> Próximos dias
          </div>

          { Sua tabela ou lista de dados aqui dentro }
          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>📅 03/06/2025 (Terça-feira)</span>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">
                4
              </span>
            </div>
            {... outras linhas }
          </div>

          <a
            href="#"
            className="text-blue-500 font-medium text-sm mt-auto flex items-center gap-1"
          >
            Ver todos os dias →
          </a>
        </div>

        { CARD 2: Últimos cortes }
        <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
          { Título }
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <span>✂️</span> Últimos cortes
          </div>

          { Sua tabela ou lista de dados aqui dentro }
          <div className="text-sm text-gray-700">
            { Conteúdo da tabela de cortes }
            <p>Tabela de clientes finalizados...</p>
          </div>

          <a
            href="#"
            className="text-blue-500 font-medium text-sm mt-auto flex items-center gap-1"
          >
            Ver histórico completo →
          </a>
        </div>
      </div>*/}
    </div>
  );
}
