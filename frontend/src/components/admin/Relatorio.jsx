"use client";

import React from "react";

export default function Relatorio({
  dadosRelatorio = [],
  servicos = [],
  filtroStatus = "todos",
  setFiltroStatus,
}) {
  return (
    <div>
      {/* Filtros Superiores */}
      <div className="flex gap-4 mb-4 flex-1">
        {/* Todos */}
        <button
          onClick={() => setFiltroStatus("todos")}
          className={`cursor-pointer p-4 rounded-2xl w-36 text-center font-bold transition ${
            filtroStatus === "todos"
              ? "bg-blue-600 text-white"
              : "bg-slate-200 text-gray-700"
          }`}
        >
          Todos os Dias
        </button>

        {/* Finalizados */}
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

        {/* Cancelados */}
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

            <th>Serviços</th> 

            {/* Finalizados */}
            {filtroStatus !== "cancelados" && (
              <th className="text-center text-green-700 font-semibold px-4">
                Finalizados
              </th>
            )}

            {/* Cancelados */}
            {filtroStatus !== "finalizados" && (
              <th className="text-center text-red-700 font-semibold px-4">
                Cancelados
              </th>
            )}
          </tr>
        </thead>
        {/* Cancelados */}
        <tbody>
          {dadosRelatorio.length > 0 ? (
            dadosRelatorio.map((item, index) => {
              /*
               * Filtra os serviços de acordo com o botão selecionado.
               */
               const servicosDoDia = item.servicos
                ?.filter((servicoItem) => {
                  if (filtroStatus === "finalizados") {
                    return servicoItem.status === "finalizado";
                  }

                  if (filtroStatus === "cancelados") {
                    return servicoItem.status === "cancelado";
                  }

                  return true;
                })
                .map((servicoItem) => {
                  
                  const servicoEncontrado = servicos.find(
                    (s) =>
                      Number(s.id) === Number(servicoItem.servico_id)
                  );

                  return {
                    ...servicoItem,
                    nome:
                      servicoEncontrado?.nome ||
                      "Serviço não encontrado",
                  };
                }) || [];
              return (
                <tr
                  key={item.data || index}
                  className="border-b hover:bg-slate-50 transition"
                >
                  {/* Número */}
                  <td className="py-4 px-4 font-medium text-gray-500">
                    {index + 1}
                  </td>

                  {/* Data do Atendimento */}
                  <td className="font-bold text-gray-700">
                    {item.data ? item.data.split("-").reverse().join("/") : "N/A"}
                  </td>

                  {/* Serviços*/} 
                  <td className="text-gray-600 py-3">
                    {servicosDoDia.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {servicosDoDia.map((servico, indexServico) => (
                          <span
                            key={`${servico.servico_id}-${servico.status}-${indexServico}`}
                          >
                            {servico.nome} ({servico.total})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        Nenhum serviço
                      </span>
                    )}
                  </td>
                  {/* Finalizados */}
                  {filtroStatus !== "cancelados" && (
                    <td className="text-center text-green-600 font-bold">
                      {item.total_finalizados ?? 0}
                    </td>
                  )}

                  {/* Cancelados */}
                  {filtroStatus !== "finalizados" && (
                    <td className="text-center text-red-500 font-bold">
                      {item.total_cancelados ?? 0}
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center py-6 text-gray-500"
              >
                Nenhum dado encontrado para este filtro.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}