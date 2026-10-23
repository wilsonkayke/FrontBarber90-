"use client";

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
        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-slate-900/90
            p-5
            shadow-xl
          "
        >
          <div className="mb-5">
            <p className="text-xs font-bold tracking-widest text-slate-500">
              ATENDIMENTOS
            </p>

            <h3 className="mt-1 text-lg font-black text-white">
              Atendimentos realizados
            </h3>
          </div>

          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-800/30">
            {dadosAtendimentos.length > 0 ? (
              <p className="text-sm text-slate-500">
                Gráfico de atendimentos
              </p>
            ) : (
              <div className="text-center">
                <div className="text-3xl">📊</div>

                <p className="mt-2 text-sm font-semibold text-slate-400">
                  Sem dados de atendimentos
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Os dados aparecerão conforme os atendimentos forem realizados.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* GRÁFICO DE SERVIÇOS */}
        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-slate-900/90
            p-5
            shadow-xl
          "
        >
          <div className="mb-5">
            <p className="text-xs font-bold tracking-widest text-slate-500">
              SERVIÇOS
            </p>

            <h3 className="mt-1 text-lg font-black text-white">
              Serviços realizados
            </h3>
          </div>

          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-800/30">
            {dadosServicos.length > 0 ? (
              <p className="text-sm text-slate-500">
                Gráfico de serviços
              </p>
            ) : (
              <div className="text-center">
                <div className="text-3xl">✂️</div>

                <p className="mt-2 text-sm font-semibold text-slate-400">
                  Sem dados de serviços
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Os serviços realizados aparecerão aqui.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}