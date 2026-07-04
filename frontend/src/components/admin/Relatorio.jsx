"use client";

import React from "react";

export default function Relatorio({
  dadosRelatorio = [], // Esta lista já chegará filtrada aqui!
  filtroStatus = "todos",
  setFiltroStatus,
}) {
  return (
    <div className="overflow-x-auto">
      
      {/* Filtros Superiores */}
      <div className="flex gap-4 mb-4 flex-1">
        <button
          onClick={() => setFiltroStatus("todos")}
          className={`cursor-pointer rounded-2xl w-36 text-center font-bold transition ${
            filtroStatus === "todos"
              ? "bg-blue-600 text-white"
              : "bg-slate-200 text-gray-700"
          }`}
        >
          Todos os Dias
        </button>

        <button
          onClick={() => setFiltroStatus("finalizados")}
          className={`cursor-pointer p-4 rounded-2xl w-48 text-center font-bold transition ${
            filtroStatus === "finalizados"
              ? "bg-green-600 text-white"
              : "bg-slate-200 text-gray-700"
          }`}
        >
          Finalizados
        </button>

        <button
          onClick={() => setFiltroStatus("cancelados")}
          className={`cursor-pointer p-4 rounded-2xl w-48 text-center font-bold transition ${
            filtroStatus === "cancelados"
              ? "bg-red-600 text-white"
              : "bg-slate-200 text-gray-700"
          }`}
        >
          Cancelados
        </button>
      </div>

      {/* Tabela de Histórico */}
      <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
        <thead>
          <tr className="bg-slate-300 text-left text-gray-700">
            <th className="py-4 px-4 w-16">#</th>
            <th>Data do Atendimento</th>
            
            {/* O cabeçalho da tabela também muda dinamicamente para esconder colunas inúteis */}
            {filtroStatus !== "cancelados" && (
              <th className="text-center text-green-700 font-semibold px-4">Finalizados</th>
            )}
            {filtroStatus !== "finalizados" && (
              <th className="text-center text-red-700 font-semibold px-4">Cancelados</th>
            )}
          </tr>
        </thead>
        <tbody>
          {dadosRelatorio.length > 0 ? (
            dadosRelatorio.map((item, index) => (
              <tr key={item.data} className="border-b hover:bg-slate-50 transition">
                <td className="py-4 px-4 font-medium text-gray-500">{index + 1}</td>
                <td className="font-bold text-gray-700">
                  {item.data.split("-").reverse().join("/")}
                </td>
                
                {/* Mostra a coluna de finalizados apenas se não estiver filtrando por cancelados */}
                {filtroStatus !== "cancelados" && (
                  <td className="text-center text-green-600 font-bold">
                    {item.total_finalizados}
                  </td>
                )}
                
                {/* Mostra a coluna de cancelados apenas se não estiver filtrando por finalizados */}
                {filtroStatus !== "finalizados" && (
                  <td className="text-center text-red-500 font-bold">
                    {item.total_cancelados}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500">
                Nenhum dado encontrado para este filtro.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}