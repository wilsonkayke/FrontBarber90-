"use client";

import React from "react";
import Topbar from "./Topbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Relatorio({
  dadosRelatorio = [],
  servicos = [],
  filtroStatus = "todos",
  setFiltroStatus,
  faturamentoHoje = 0,
  faturamentoSemana = 0,
  faturamentoMes = 0,
  faturamentoTotal = 0,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  dados,
  dadosGrafico,
}) {
  const dadosGraficoServicos =
    dados?.relatorio?.reduce((acumulado, dia) => {
      dia.servicos.forEach((servico) => {
        const existente = acumulado.find(
          (item) => item.servico_id === servico.servico_id,
        );

        if (existente) {
          existente.quantidade += servico.total;
        } else {
          acumulado.push({
            servico_id: servico.servico_id,
            quantidade: servico.total,
          });
        }
      });

      return acumulado;
    }, []) || [];

  // =====================================================
  // FORMATAR VALORES EM REAL
  // =====================================================
  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div>
      {/* =====================================================
          CARDS DE FATURAMENTO
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Faturamento Hoje */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-sm font-semibold text-gray-500">
            Faturamento Hoje
          </h1>

          <p className="text-2xl font-bold text-green-600 mt-2">
            {formatarMoeda(faturamentoHoje)}
          </p>
        </div>

        {/* Faturamento Semana */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-sm font-semibold text-gray-500">
            Faturamento da Semana
          </h1>

          <p className="text-2xl font-bold text-blue-600 mt-2">
            {formatarMoeda(faturamentoSemana)}
          </p>
        </div>

        {/* Faturamento Mês */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-sm font-semibold text-gray-500">
            Faturamento do Mês
          </h1>

          <p className="text-2xl font-bold text-purple-600 mt-2">
            {formatarMoeda(faturamentoMes)}
          </p>
        </div>

        {/* Faturamento Total */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-sm font-semibold text-gray-500">
            Faturamento Total
          </h1>

          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatarMoeda(faturamentoTotal)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Filtrar por período
        </h2>

        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Data inicial
            </label>

            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Data final
            </label>

            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setDataInicio("");
              setDataFim("");
            }}
            className="py-4 px-4 bg-gray-600 hover:bg-gray-300 text-white rounded-lg font-medium transition"
          >
            Limpar datas
          </button>
        </div>
      </div>

      {/* =====================================================
          FILTROS SUPERIORES
      ===================================================== */}

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

      {/* =====================================================
          TABELA DE HISTÓRICO
      ===================================================== */}

      <div className="w-full overflow-x-auto rounded-2xl shadow-md">
        <table className="w-full min-w-[500px] bg-white text-left">
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

          {/* =====================================================
            CORPO DA TABELA
        ===================================================== */}

          <tbody>
            {dadosRelatorio.length > 0 ? (
              dadosRelatorio.map((item, index) => {
                /*
                 * Filtra os serviços de acordo com o botão selecionado.
                 */

                const servicosDoDia =
                  item.servicos
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
                        (s) => Number(s.id) === Number(servicoItem.servico_id),
                      );

                      return {
                        ...servicoItem,

                        nome:
                          servicoEncontrado?.nome || "Serviço não encontrado",
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
                      {item.data
                        ? item.data.split("-").reverse().join("/")
                        : "N/A"}
                    </td>

                    {/* Serviços */}
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
                        <span className="text-gray-400">Nenhum serviço</span>
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
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Nenhum dado encontrado para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-200 p-5 mt-3">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-800">
            Atendimentos por serviço
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Quantidade de serviços realizados no período selecionado.
          </p>
        </div>

        <div className="bg-slate-100 rounded-2xl shadow-md p-5">
          {dadosGrafico && dadosGrafico.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGrafico}
              margin={{
                top:20,
                right: 20,
                left: 0,
                bottom: 10,
              }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="servico"
                tick={{fontSize: 12}}
                tickLine={false}
                axisLine={false}  

                />
                <YAxis allowDecimals={false} 
                tick={{fontSize: 12}}
                tickLine={false}
                axisLine={false}  
                />

                <Tooltip
                  cursor={{opacity: 0.38}}
                  formatter={(value) => [`${value} atendimentos`, "Quantidade"]}
                  labelStyle={{fontWeight: "600",}}
                />

                <Bar dataKey="quantidade" name="Atendimentos" 
                radius={[8, 8, 0, 0]}
                barSize={45}
                fill="#22d3ee"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Nenhum dado disponível para o período selecionado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
