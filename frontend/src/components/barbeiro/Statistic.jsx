
"use client";

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

export function Statistic({
  dadosAtendimentos = [],
  dadosServicos = [],
}) {

  

  return (
    <section className="w-full space-y-5">
      {/* CABEÇALHO */}
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-slate-500">
          DESEMPENHO
        </p>

        <h2 className="mt-1 text-2xl font-black text-white">
          Suas estatísticas
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Acompanhe seu desempenho e seus atendimentos.
        </p>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* GRÁFICO DE ATENDIMENTOS */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-xl">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-widest text-slate-500">
              ATENDIMENTOS
            </p>

            <h3 className="mt-1 text-lg font-black text-white">
              Atendimentos realizados
            </h3>
          </div>

          <div className="h-64">
            {dadosAtendimentos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dadosAtendimentos}
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
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-800/30">
                <div className="text-center">
                  <div className="text-3xl">📊</div>

                  <p className="mt-2 text-sm font-semibold text-slate-400">
                    Sem dados de atendimentos
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Os dados aparecerão conforme os atendimentos forem realizados.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* GRÁFICO DE SERVIÇOS */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-xl">
          <div className="mb-5">
            <p className="text-xs font-bold tracking-widest text-slate-500">
              SERVIÇOS
            </p>

            <h3 className="mt-1 text-lg font-black text-white">
              Serviços realizados
            </h3>
          </div>

          <div className="h-64">
            {dadosServicos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosServicos}
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
                    name="Serviços"
                    radius={[8, 8, 0, 0]}
                    barSize={42}
                    fill="#38bdf8"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-800/30">
                <div className="text-center">
                  <div className="text-3xl">✂️</div>

                  <p className="mt-2 text-sm font-semibold text-slate-400">
                    Sem dados de serviços
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Os serviços realizados aparecerão aqui.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
