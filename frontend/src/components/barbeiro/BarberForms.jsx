"use client";

export function BarberForms({
  data = [],
  faturamentoHoje = 0,
  servicos = [],
  dadosAtendimentos = [],
  dadosServicos = [],
  diaSelecionado,
  setDiaSelecionado,
  datasDisponiveis,
  mostrarCalendario,
  setMostrarCalendario,
  onChamar,
  onFinalizar,
  carregando,
  erro,
}) {
  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (data) => {
    if (!data) return "";

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  };

  const obterServico = (servicoId) => {
    return servicos.find((servico) => Number(servico.id) === Number(servicoId));
  };

  const formatarHorario = (horario) => {
    if (!horario) return "--:--";

    return new Date(horario + "Z").toLocaleTimeString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const obterDataHoje = () => {
    return new Date().toLocaleDateString("sv-SE", {
      timeZone: "America/Sao_Paulo",
    });
  };

  const obterDataAmanha = () => {
    const hoje = new Date();

    hoje.setDate(hoje.getDate() + 1);

    return hoje.toLocaleDateString("sv-SE", {
      timeZone: "America/Sao_Paulo",
    });
  };

  const dataFiltrada = data.filter((cliente) => {
    if (!cliente.horario) return false;

    const dataCliente = new Date(cliente.horario).toLocaleDateString("sv-SE", {
      timeZone: "America/Sao_Paulo",
    });

    if (diaSelecionado === "hoje") {
      return dataCliente === obterDataHoje();
    }

    if (diaSelecionado === "amanha") {
      return dataCliente === obterDataAmanha();
    }

    return dataCliente === diaSelecionado;
  });
  return (
    <section className="w-full space-y-5">
      {/* CABEÇALHO */}
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-slate-500">
          ATENDIMENTOS
        </p>

        <h2 className="mt-1 text-2xl font-black text-white">
          Fila de clientes
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Gerencie seus atendimentos e acompanhe os próximos clientes.
        </p>
      </div>

      {/* FILTRO DE DATA */}
      <div className="relative flex flex-wrap items-center gap-3">
        {/* HOJE */}
        <button
          type="button"
          onClick={() => {
            setDiaSelecionado("hoje");
            setMostrarCalendario(false);
          }}
          className={`
            rounded-xl
            border
            px-5
            py-3
            text-sm
            font-bold
            transition-all
            duration-200
            ${
              diaSelecionado === "hoje"
                ? `
                  border-sky-400/40
                  bg-sky-500
                  text-white
                  shadow-lg
                  shadow-sky-900/30
                `
                : `
                  border-white/10
                  bg-slate-900/90
                  text-slate-300
                  hover:border-sky-400/30
                  hover:bg-slate-800
                  hover:text-white
                `
            }
          `}
        >
          Hoje
        </button>

        {/* AMANHÃ */}
        <button
          type="button"
          onClick={() => {
            setDiaSelecionado("amanha");
            setMostrarCalendario(false);
          }}
          className={`
            rounded-xl
            border
            px-5
            py-3
            text-sm
            font-bold
            transition-all
            duration-200
            ${
              diaSelecionado === "amanha"
                ? `
                  border-sky-400/40
                  bg-sky-500
                  text-white
                  shadow-lg
                  shadow-sky-900/30
                `
                : `
                  border-white/10
                  bg-slate-900/90
                  text-slate-300
                  hover:border-sky-400/30
                  hover:bg-slate-800
                  hover:text-white
                `
            }
          `}
        >
          Amanhã
        </button>

        {/* CALENDÁRIO */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMostrarCalendario(!mostrarCalendario)}
            className={`
              flex
              items-center
              gap-2
              rounded-xl
              border
              px-5
              py-3
              text-sm
              font-bold
              transition-all
              duration-200
              ${
                mostrarCalendario
                  ? `
                    border-sky-400/40
                    bg-sky-500
                    text-white
                  `
                  : `
                    border-white/10
                    bg-slate-900/90
                    text-slate-300
                    hover:border-sky-400/30
                    hover:bg-slate-800
                    hover:text-white
                  `
              }
            `}
          >
            <span>📅</span>
            Calendário
          </button>

          {mostrarCalendario && (
            <div
              className="
                absolute
                left-0
                top-full
                z-50
                mt-3
                w-72
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-slate-900
                shadow-2xl
              "
            >
              <div className="border-b border-white/10 px-4 py-4">
                <p className="text-xs font-bold tracking-widest text-slate-500">
                  DATAS DISPONÍVEIS
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  Selecione um dia
                </p>
              </div>

              {datasDisponiveis.length > 0 ? (
                <div className="max-h-72 overflow-y-auto">
                  {datasDisponiveis.map((item) => (
                    <button
                      key={item.data}
                      type="button"
                      onClick={() => {
                        setDiaSelecionado(item.data);
                        setMostrarCalendario(false);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        border-b
                        border-white/5
                        px-4
                        py-3
                        text-left
                        transition
                        hover:bg-slate-800
                      "
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          📅 {formatarData(item.data)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.quantidade} agendamento(s)
                        </p>
                      </div>

                      <span className="text-slate-500">→</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-8 text-center">
                  <div className="text-2xl">📅</div>

                  <p className="mt-2 text-sm font-semibold text-slate-400">
                    Nenhuma data encontrada
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Não existem agendamentos disponíveis.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RESUMO DO DIA */}
      <div
        className="
          flex
          flex-col
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-slate-900/90
          p-4
          shadow-xl
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <p className="text-xs font-bold tracking-widest text-slate-500">
            RESUMO DE HOJE
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {dataFiltrada.length} cliente(s) na lista
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs font-bold tracking-widest text-slate-500">
            FATURAMENTO
          </p>

          <p className="mt-1 text-xl font-black text-emerald-400">
            {formatarMoeda(faturamentoHoje)}
          </p>
        </div>
      </div>

      {/* PRÓXIMO CLIENTE */}
      {dataFiltrada.length > 0 && (
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-sky-400/20
            bg-slate-900/90
            shadow-xl
          "
        >
          <div className="border-b border-white/10 bg-sky-500/5 px-5 py-4">
            <p className="text-xs font-bold tracking-[0.2em] text-sky-400">
              PRÓXIMO CLIENTE
            </p>
          </div>

          {(() => {
            const cliente = dataFiltrada[0];
            const servico = obterServico(cliente.servico_id);

            return (
              <div className="p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-sky-400/20
                        bg-sky-400/10
                        text-2xl
                      "
                    >
                      👤
                    </div>

                    <div>
                      <p className="text-lg font-black text-white">
                        {cliente.nome}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {servico?.nome || "Serviço não encontrado"}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        ⏰ {formatarHorario(cliente.horario)}
                      </p>
                    </div>
                  </div>

                  {cliente.status === "em_atendimento" ? (
                    <button
                      onClick={() => onFinalizar(cliente)}
                      className="rounded-xl
                      border
                      border-emerald-400/20
                      bg-emerald-500/10
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-emerald-300
                      shadow-sm
                      transition-all
                      hover:border-emerald-400/40
                      hover:bg-emerald-500
                      hover:text-white
                      active:scale-95"
                    >
                      Finalizar
                    </button>
                  ) : (
                    <button onClick={() => onChamar(cliente)} className="rounded-xl
                      border
                      border-sky-400/20
                      bg-sky-500/10
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-sky-300
                      shadow-sm
                      transition-all
                      hover:border-sky-400/40
                      hover:bg-sky-500
                      hover:text-white
                      active:scale-95">
                      Chamar cliente
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* FILA */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-slate-900/90
          shadow-xl
        "
      >
        <div
          className="
            flex
            flex-col
            gap-2
            border-b
            border-white/10
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-slate-500">
              FILA DE ATENDIMENTO
            </p>

            <h3 className="mt-1 text-lg font-black text-white">
              Clientes aguardando
            </h3>
          </div>

          <span
            className="
              w-fit
              rounded-full
              border
              border-sky-400/20
              bg-sky-400/10
              px-3
              py-1
              text-xs
              font-bold
              text-sky-300
            "
          >
            {dataFiltrada.length} cliente(s)
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {dataFiltrada.length > 0 ? (
            dataFiltrada.map((cliente, index) => {
              const servico = obterServico(cliente.servico_id);

              return (
                <div
                  key={cliente._id}
                  className="
                    flex
                    flex-col
                    gap-4
                    px-5
                    py-4
                    transition
                    hover:bg-slate-800/50
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-800
                        text-sm
                        font-black
                        text-slate-400
                      "
                    >
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-bold text-white">{cliente.nome}</p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {servico?.nome || "Serviço não encontrado"}
                        </span>

                        {servico && (
                          <span className="text-xs font-semibold text-emerald-400">
                            {formatarMoeda(servico.preco)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <span
                      className="
                        rounded-lg
                        border
                        border-white/10
                        bg-slate-800
                        px-3
                        py-2
                        text-center
                        text-xs
                        font-bold
                        text-slate-300
                      "
                    >
                      ⏰ {formatarHorario(cliente.horario)}
                    </span> 
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="text-4xl">✂️</div>

              <p className="mt-3 text-sm font-bold text-slate-400">
                Nenhum cliente aguardando
              </p>

              <p className="mt-1 text-xs text-slate-600">
                A fila está vazia no momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
