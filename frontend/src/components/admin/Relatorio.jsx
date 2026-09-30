 "use client";

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  // =====================================================
  // DADOS DOS SERVIÇOS
  // =====================================================

  const dadosGraficoServicos =
    dados?.relatorio?.reduce((acumulado, dia) => {
      dia.servicos?.forEach((servico) => {
        const existente = acumulado.find(
          (item) => item.servico_id === servico.servico_id
        );

        if (existente) {
          existente.quantidade += servico.total;
        } else {
          acumulado.push({
            servico_id: servico.servico_id,
            quantidade: servico.total,
            nome:
              servicos.find(
                (item) =>
                  Number(item.id) === Number(servico.servico_id)
              )?.nome || "Serviço",
          });
        }
      });

      return acumulado;
    }, []) || [];

  // =====================================================
  // DADOS PARA O GRÁFICO DE MOVIMENTO POR DIA
  // =====================================================

  const dadosGraficoMovimento =
    dados?.relatorio?.map((item) => ({
      data: item.data
        ? item.data.split("-").reverse().slice(0, 2).join("/")
        : "N/A",
      atendimentos:
        (item.total_finalizados || 0) + (item.total_cancelados || 0),
      finalizados: item.total_finalizados || 0,
      cancelados: item.total_cancelados || 0,
    })) || [];

  // =====================================================
  // SERVIÇO MAIS UTILIZADO
  // =====================================================

  const servicoMaisUtilizado =
    dadosGraficoServicos.length > 0
      ? [...dadosGraficoServicos].sort(
          (a, b) => b.quantidade - a.quantidade
        )[0]
      : null;

  // =====================================================
  // TOTAL DE ATENDIMENTOS
  // =====================================================

  const totalFinalizados = dadosRelatorio.reduce(
    (total, item) => total + (item.total_finalizados || 0),
    0
  );

  const totalCancelados = dadosRelatorio.reduce(
    (total, item) => total + (item.total_cancelados || 0),
    0
  );

  // =====================================================
  // FORMATAR MOEDA
  // =====================================================

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="w-full text-slate-100">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-blue-600">
              Relatório administrativo
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Acompanhe o movimento, os serviços realizados e os resultados
              financeiros da barbearia.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CARDS FINANCEIROS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        {/* HOJE */}
        <div
          className="
            group relative overflow-hidden
            rounded-2xl
            border border-emerald-400/20
            bg-slate-900/90
            p-5
            shadow-xl
            transition-all duration-200
            hover:-translate-y-1
            hover:border-emerald-400/40
          "
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl transition-all group-hover:bg-emerald-400/20" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-400">
                HOJE
              </p>

              <p className="mt-2 text-2xl font-black text-emerald-400">
                {formatarMoeda(faturamentoHoje)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Faturamento do dia
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xl">
              💰
            </div>
          </div>
        </div>

        {/* SEMANA */}
        <div
          className="
            group relative overflow-hidden
            rounded-2xl
            border border-sky-400/20
            bg-slate-900/90
            p-5
            shadow-xl
            transition-all duration-200
            hover:-translate-y-1
            hover:border-sky-400/40
          "
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl transition-all group-hover:bg-sky-400/20" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-400">
                SEMANA
              </p>

              <p className="mt-2 text-2xl font-black text-sky-400">
                {formatarMoeda(faturamentoSemana)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Faturamento semanal
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-xl">
              📈
            </div>
          </div>
        </div>

        {/* MÊS */}
        <div
          className="
            group relative overflow-hidden
            rounded-2xl
            border border-violet-400/20
            bg-slate-900/90
            p-5
            shadow-xl
            transition-all duration-200
            hover:-translate-y-1
            hover:border-violet-400/40
          "
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-400/10 blur-2xl transition-all group-hover:bg-violet-400/20" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-400">
                MÊS
              </p>

              <p className="mt-2 text-2xl font-black text-violet-400">
                {formatarMoeda(faturamentoMes)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Faturamento mensal
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-xl">
              📊
            </div>
          </div>
        </div>

        {/* TOTAL */}
        <div
          className="
            group relative overflow-hidden
            rounded-2xl
            border border-amber-400/20
            bg-slate-900/90
            p-5
            shadow-xl
            transition-all duration-200
            hover:-translate-y-1
            hover:border-amber-400/40
          "
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl transition-all group-hover:bg-amber-400/20" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-400">
                TOTAL
              </p>

              <p className="mt-2 text-2xl font-black text-amber-400">
                {formatarMoeda(faturamentoTotal)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Faturamento acumulado
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-xl">
              💎
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RESUMO OPERACIONAL
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-xl">
          <p className="text-xs font-bold tracking-widest text-slate-400">
            FINALIZADOS
          </p>

          <div className="mt-3 flex items-end justify-between">
            <p className="text-3xl font-black text-emerald-400">
              {totalFinalizados}
            </p>

            <span className="rounded-xl bg-emerald-400/10 px-3 py-2 text-lg">
              ✓
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Atendimentos concluídos no período
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-xl">
          <p className="text-xs font-bold tracking-widest text-slate-400">
            CANCELADOS
          </p>

          <div className="mt-3 flex items-end justify-between">
            <p className="text-3xl font-black text-red-400">
              {totalCancelados}
            </p>

            <span className="rounded-xl bg-red-400/10 px-3 py-2 text-lg">
              ×
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Cancelamentos no período
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-xl">
          <p className="text-xs font-bold tracking-widest text-slate-400">
            SERVIÇO DESTAQUE
          </p>

          <div className="mt-3">
            <p className="truncate text-xl font-black text-white">
              {servicoMaisUtilizado?.nome || "Nenhum serviço"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {servicoMaisUtilizado
                ? `${servicoMaisUtilizado.quantidade} atendimento(s)`
                : "Sem dados no período"}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTRO POR PERÍODO
      ===================================================== */}

      <div
        className="
          mb-6
          rounded-2xl
          border border-white/10
          bg-slate-900/90
          p-5
          shadow-xl
        "
      >
        <div className="mb-4">
          <p className="text-xs font-bold tracking-[0.2em] text-slate-400">
            PERÍODO
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">
            Filtrar resultados
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Selecione um intervalo para analisar os atendimentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-400">
              Data inicial
            </label>

            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="
                w-full rounded-xl
                border border-white/10
                bg-slate-800
                px-4 py-3
                text-sm text-white
                outline-none
                transition
                focus:border-sky-400/50
                focus:ring-2
                focus:ring-sky-400/10
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-400">
              Data final
            </label>

            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="
                w-full rounded-xl
                border border-white/10
                bg-slate-800
                px-4 py-3
                text-sm text-white
                outline-none
                transition
                focus:border-sky-400/50
                focus:ring-2
                focus:ring-sky-400/10
              "
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setDataInicio("");
              setDataFim("");
            }}
            className="
              rounded-xl
              border border-white/10
              bg-slate-800
              px-4 py-3
              text-sm font-bold text-slate-300
              transition-all
              hover:border-white/20
              hover:bg-slate-700
              hover:text-white
            "
          >
            Limpar datas
          </button>
        </div>
      </div>

      {/* =====================================================
          FILTROS DE STATUS
      ===================================================== */}

      <div
        className="
          mb-6
          flex flex-col gap-3
          rounded-2xl
          border border-white/10
          bg-slate-900/90
          p-3
          shadow-xl
          sm:flex-row
        "
      >
        <button
          type="button"
          onClick={() => setFiltroStatus("todos")}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
            filtroStatus === "todos"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-900/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Todos os dias
        </button>

        <button
          type="button"
          onClick={() => setFiltroStatus("finalizados")}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
            filtroStatus === "finalizados"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Finalizados
        </button>

        <button
          type="button"
          onClick={() => setFiltroStatus("cancelados")}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
            filtroStatus === "cancelados"
              ? "bg-red-500 text-white shadow-lg shadow-red-900/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Cancelados
        </button>
      </div>

      {/* =====================================================
          GRÁFICOS
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        {/* SERVIÇOS */}
        <div
          className="
            rounded-2xl
            border border-white/10
            bg-slate-900/90
            p-5
            shadow-xl
          "
        >
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.2em] text-slate-400">
              DESEMPENHO
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              Atendimentos por serviço
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Quantidade de serviços realizados no período selecionado.
            </p>
          </div>

          <div className="h-[320px]">
            {dadosGraficoServicos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosGraficoServicos}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="nome"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `${value} atendimento(s)`,
                      "Quantidade",
                    ]}
                  />

                  <Bar
                    dataKey="quantidade"
                    name="Atendimentos"
                    radius={[8, 8, 0, 0]}
                    barSize={42}
                    fill="#38bdf8"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-500">
                Nenhum dado disponível para o período selecionado.
              </div>
            )}
          </div>
        </div>

        {/* MOVIMENTO */}
        <div
          className="
            rounded-2xl
            border border-white/10
            bg-slate-900/90
            p-5
            shadow-xl
          "
        >
          <div className="mb-5">
            <p className="text-xs font-bold tracking-[0.2em] text-slate-400">
              MOVIMENTO
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              Evolução dos atendimentos
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Acompanhe o volume de atendimentos ao longo do período.
            </p>
          </div>

          <div className="h-[320px]">
            {dadosGraficoMovimento.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dadosGraficoMovimento}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="data"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `${value} atendimento(s)`,
                      "Total",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="atendimentos"
                    name="Atendimentos"
                    stroke="#a78bfa"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill: "#0f172a",
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-500">
                Nenhum movimento disponível para o período selecionado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          TABELA DE HISTÓRICO
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-white/10
          bg-slate-900/90
          shadow-xl
        "
      >
        <div className="border-b border-white/10 p-5">
          <p className="text-xs font-bold tracking-[0.2em] text-slate-400">
            HISTÓRICO
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            Atendimentos por período
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Consulte os serviços, finalizações e cancelamentos registrados.
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">

            <thead>
              <tr className="border-b border-white/10 bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Data</th>
                <th className="px-5 py-4">Serviços</th>

                {filtroStatus !== "cancelados" && (
                  <th className="px-5 py-4 text-center text-emerald-400">
                    Finalizados
                  </th>
                )}

                {filtroStatus !== "finalizados" && (
                  <th className="px-5 py-4 text-center text-red-400">
                    Cancelados
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {dadosRelatorio.length > 0 ? (
                dadosRelatorio.map((item, index) => {

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
                          (s) =>
                            Number(s.id) ===
                            Number(servicoItem.servico_id)
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
                      className="
                        border-b border-white/5
                        transition-colors
                        hover:bg-white/[0.03]
                      "
                    >
                      <td className="px-5 py-4 text-sm font-bold text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-white">
                          {item.data
                            ? item.data.split("-").reverse().join("/")
                            : "N/A"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {servicosDoDia.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {servicosDoDia.map(
                              (servico, indexServico) => (
                                <span
                                  key={`${servico.servico_id}-${servico.status}-${indexServico}`}
                                  className="
                                    inline-flex items-center gap-2
                                    rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-3 py-2
                                    text-xs font-semibold
                                    text-slate-300
                                  "
                                >
                                  <span className="text-sky-400">
                                    ✂
                                  </span>

                                  {servico.nome}

                                  <span className="rounded-md bg-slate-700 px-1.5 py-0.5 text-slate-200">
                                    {servico.total}
                                  </span>
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-600">
                            Nenhum serviço
                          </span>
                        )}
                      </td>

                      {filtroStatus !== "cancelados" && (
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex min-w-9 justify-center rounded-lg bg-emerald-400/10 px-3 py-1.5 text-sm font-bold text-emerald-400">
                            {item.total_finalizados ?? 0}
                          </span>
                        </td>
                      )}

                      {filtroStatus !== "finalizados" && (
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex min-w-9 justify-center rounded-lg bg-red-400/10 px-3 py-1.5 text-sm font-bold text-red-400">
                            {item.total_cancelados ?? 0}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center"
                  >
                    <p className="text-sm font-semibold text-slate-400">
                      Nenhum dado encontrado para este filtro.
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Tente alterar o período ou o status selecionado.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
