"use client";

export default function Barbeiros({
  barbeiros = [],
  onAdicionar,
}) {
  const limite = 4;
  const quantidade = barbeiros.length;
  const limiteAtingido = quantidade >= limite;

  return (
    <section
      className="
        w-full
        rounded-2xl
        border border-white/10
        bg-slate-900/90
        p-5
        shadow-xl
      "
    >
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-slate-400">
            EQUIPE
          </p>

          <h2 className="mt-1 text-xl font-black text-white">
            Barbeiros
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Gerencie sua equipe e acompanhe o desempenho.
          </p>
        </div>

        <button
          type="button"
          disabled={limiteAtingido}
          onClick={onAdicionar}
          className={`
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            px-4
            py-3
            text-sm
            font-bold
            transition-all
            ${
              limiteAtingido
                ? `
                  cursor-not-allowed
                  border border-white/5
                  bg-slate-800
                  text-slate-600
                `
                : `
                  cursor-pointer
                  border border-emerald-400/20
                  bg-emerald-500/10
                  text-emerald-300
                  hover:-translate-y-0.5
                  hover:border-emerald-400/40
                  hover:bg-emerald-500
                  hover:text-white
                `
            }
          `}
        >
          <span className="text-lg">
            {limiteAtingido ? "✓" : "+"}
          </span>

          {limiteAtingido
            ? "Limite atingido"
            : "Adicionar barbeiro"}
        </button>
      </div>

      {/* RESUMO */}
      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          rounded-xl
          border border-white/10
          bg-slate-800/60
          px-4
          py-3
        "
      >
        <div>
          <p className="text-xs font-bold tracking-wider text-slate-500">
            BARBEIROS CADASTRADOS
          </p>

          <p className="mt-1 text-sm text-slate-300">
            Sua equipe atual
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-white">
            {quantidade}
          </span>

          <span className="text-sm font-semibold text-slate-500">
            {" "}
            / {limite}
          </span>
        </div>
      </div>

      {/* LISTA */}
      <div className="mt-4 space-y-3">

        {barbeiros.length > 0 ? (
          barbeiros.map((barbeiro) => (
            <div
              key={barbeiro.id}
              className="
                group
                rounded-2xl
                border border-white/10
                bg-slate-800/60
                p-4
                transition-all
                hover:border-white/20
                hover:bg-slate-800
              "
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                {/* IDENTIFICAÇÃO */}
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border border-sky-400/20
                      bg-sky-400/10
                      text-lg
                    "
                  >
                    👤
                  </div>

                  <div>
                    <p className="font-bold text-white">
                      {barbeiro.nome}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Barbeiro
                    </p>
                  </div>
                </div>

                {/* DESEMPENHO */}
                <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">

                  <div
                    className="
                      rounded-xl
                      border border-white/5
                      bg-slate-900/70
                      px-4
                      py-3
                    "
                  >
                    <p className="text-[10px] font-bold tracking-wider text-slate-500">
                      ATENDIMENTOS
                    </p>

                    <p className="mt-1 text-lg font-black text-sky-400">
                      {barbeiro.atendimentos ?? 0}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl
                      border border-white/5
                      bg-slate-900/70
                      px-4
                      py-3
                    "
                  >
                    <p className="text-[10px] font-bold tracking-wider text-slate-500">
                      FATURAMENTO
                    </p>

                    <p className="mt-1 text-lg font-black text-emerald-400">
                      {Number(
                        barbeiro.faturamento ?? 0
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="
              rounded-2xl
              border border-dashed border-white/10
              bg-slate-800/30
              px-5
              py-10
              text-center
            "
          >
            <div className="text-3xl">👤</div>

            <p className="mt-3 text-sm font-semibold text-slate-400">
              Nenhum barbeiro cadastrado
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Adicione um barbeiro para começar a acompanhar o desempenho.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}