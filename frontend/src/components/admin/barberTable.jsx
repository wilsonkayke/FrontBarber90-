"use client";

export default function BarberTable({
  data = [],
  onChamar,
  onFinalizar,
  faturamentoHoje = 0,
  diaSelecionado,
  setDiaSelecionado,
  servicos = [],
  datasDisponiveis = [],
  mostrarCalendario,
  setMostrarCalendario,
  
}) {

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };


  return (
    <div className="relative overflow-x-auto">
      <div className="mb-5">
        <div
  className="
    group
    relative
    h-24
    w-80
    overflow-hidden
    rounded-2xl
    border border-emerald-400/20
    bg-slate-900/90
    backdrop-blur-md
    p-4
    shadow-xl
    transition-all
    duration-200
    hover:-translate-y-1
    hover:border-emerald-400/40
    hover:shadow-emerald-900/20
  "
>
  {/* Brilho discreto */}
  <div
    className="
      absolute
      -right-6
      -top-6
      h-20
      w-20
      rounded-full
      bg-emerald-400/10
      blur-2xl
      transition-all
      duration-300
      group-hover:bg-emerald-400/20
    "
  />

  <div className="relative flex items-center justify-between h-full">

    <div>
      <p className="text-xs font-bold tracking-widest text-gray-400">
        FATURAMENTO HOJE
      </p>

      <p className="mt-1 text-2xl font-black text-emerald-400">
        {formatarMoeda(faturamentoHoje)}
      </p>
    </div>

    <div
      className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        border border-emerald-400/20
        bg-emerald-400/10
        text-xl
      "
    >
      💰
    </div>

  </div>
</div>
      </div>
      {/* Filtros */}
      <div className="flex gap-4 mb-4 flex-1">
        {/* Calendário */}
        <div className="relative">
  <button
    onClick={() => setMostrarCalendario(!mostrarCalendario)}
    className={`
      flex
      items-center
      justify-center
      gap-2
      w-40
      rounded-2xl
      border
      px-4
      py-3
      text-sm
      font-bold
      transition-all
      duration-200
      cursor-pointer
      ${
        mostrarCalendario
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
            shadow-lg
            hover:-translate-y-0.5
            hover:border-sky-400/30
            hover:bg-slate-800
            hover:text-white
          `
      }
    `}
  >
    <span className="text-base">📅</span>

    <span>Calendário</span>
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
        shadow-black/40
      "
    >
      {/* Cabeçalho */}
      <div className="border-b border-white/10 bg-slate-800/70 px-4 py-3">
        <p className="text-xs font-bold tracking-widest text-slate-400">
          DATAS DISPONÍVEIS
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          Selecione um dia
        </p>
      </div>

      {/* Datas */}
      <div className="max-h-80 overflow-y-auto">
        {datasDisponiveis.length > 0 ? (
          datasDisponiveis.map((item) => (
            <button
              key={item.data}
              onClick={() => {
                setDiaSelecionado(item.data);
                setMostrarCalendario(false);
              }}
              className="
                group
                w-full
                border-b
                border-white/5
                px-4
                py-3
                text-left
                transition-all
                last:border-none
                hover:bg-white/[0.04]
              "
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-sky-400/20
                      bg-sky-400/10
                      text-sm
                    "
                  >
                    📅
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-200 transition-colors group-hover:text-white">
                      {item.data}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.quantidade} agendamento(s)
                    </p>
                  </div>
                </div>

                <span className="text-slate-600 transition-colors group-hover:text-sky-400">
                  →
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <div className="mb-2 text-2xl">📅</div>

            <p className="text-sm font-semibold text-slate-400">
              Nenhuma data encontrada
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Não existem agendamentos disponíveis.
            </p>
          </div>
        )}
      </div>
    </div>
  )}
</div>

        {/* Hoje */}
        {/* Hoje */}
<div
  onClick={() => {
    setDiaSelecionado("hoje");
    setMostrarCalendario(false);
  }}
  className={`
    flex
    items-center
    justify-center
    w-32
    rounded-2xl
    border
    px-4
    py-3
    text-sm
    font-bold
    cursor-pointer
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
          shadow-lg
          hover:-translate-y-0.5
          hover:border-sky-400/30
          hover:bg-slate-800
          hover:text-white
        `
    }
  `}
>
  Hoje
</div>

{/* Amanhã */}
<div
  onClick={() => {
    setDiaSelecionado("amanha");
    setMostrarCalendario(false);
  }}
  className={`
    flex
    items-center
    justify-center
    w-32
    rounded-2xl
    border
    px-4
    py-3
    text-sm
    font-bold
    cursor-pointer
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
          shadow-lg
          hover:-translate-y-0.5
          hover:border-sky-400/30
          hover:bg-slate-800
          hover:text-white
        `
    }
  `}
>
  Amanhã
</div>

        {/* Todos 
        <div
          onClick={() => {
            setDiaSelecionado("todos");
            setMostrarCalendario(false);
          }}
          className={`
            cursor-pointer
            p-4
            rounded-2xl
            w-32
            text-center
            font-bold
            transition
            ${
              diaSelecionado === "todos"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-gray-700"
            }
          `}
        >
          Todos
        </div>
        */}
      </div>

      {/* Tabela */}
     {/* DESKTOP */}
<div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-xl">
  <table className="w-full table-fixed">

    {/* CABEÇALHO */}
    <thead>
      <tr className="border-b border-white/10 bg-slate-800/80 text-left">
        <th className="w-[8%] px-5 py-4 text-xs font-bold tracking-wider text-slate-400">
          #
        </th>

        <th className="w-[22%] px-5 py-4 text-xs font-bold tracking-wider text-slate-400">
          CLIENTE
        </th>

        <th className="w-[28%] px-5 py-4 text-center text-xs font-bold tracking-wider text-slate-400">
          SERVIÇO
        </th>

        <th className="w-[17%] px-5 py-4 text-center text-xs font-bold tracking-wider text-slate-400">
          HORÁRIO
        </th>

        <th className="w-[25%] px-5 py-4 text-center text-xs font-bold tracking-wider text-slate-400">
          AÇÕES
        </th>
      </tr>
    </thead>

    {/* CORPO */}
    <tbody>
      {data.length > 0 ? (
        data.map((cliente, index) => {
          const servico = servicos.find(
            (s) => Number(s.id) === Number(cliente.servico_id)
          );

          return (
            <tr
              key={cliente._id}
              className="
                border-b
                border-white/5
                transition-all
                hover:bg-white/[0.03]
              "
            >
              {/* POSIÇÃO */}
              <td className="px-5 py-5">
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-800
                    text-sm
                    font-bold
                    text-slate-400
                  "
                >
                  {index + 1}
                </span>
              </td>

              {/* CLIENTE */}
              <td className="px-5 py-5">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">
                    {cliente.nome}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Cliente aguardando atendimento
                  </p>
                </div>
              </td>

              {/* SERVIÇO */}
              <td className="px-5 py-5 text-center">
                {servico ? (
                  <div className="flex flex-col items-center">
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-lg
                        border
                        border-sky-400/20
                        bg-sky-400/10
                        px-3
                        py-1.5
                        text-sm
                        font-semibold
                        text-sky-300
                      "
                    >
                      ✂ {servico.nome}
                    </span>

                    <span className="mt-1.5 text-xs text-slate-500">
                      {Number(servico.preco).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="rounded-lg bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-400">
                    Serviço não encontrado
                  </span>
                )}
              </td>

              {/* HORÁRIO */}
              <td className="px-5 py-5 text-center">
                <span
                  className="
                    inline-flex
                    rounded-lg
                    bg-slate-800
                    px-3
                    py-2
                    text-sm
                    font-bold
                    text-slate-200
                  "
                >
                  {new Date(cliente.horario + "Z").toLocaleTimeString(
                    "pt-BR",
                    {
                      timeZone: "America/Sao_Paulo",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </td>

              {/* AÇÕES */}
              <td className="px-5 py-5">
                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onChamar(cliente)}
                    className="
                      rounded-xl
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
                      active:scale-95
                    "
                  >
                    Chamar
                  </button>

                  <button
                    onClick={() => onFinalizar(cliente)}
                    className="
                      rounded-xl
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
                      active:scale-95
                    "
                  >
                    Finalizar
                  </button>

                </div>
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td
            colSpan="5"
            className="px-5 py-14 text-center"
          >
            <div className="flex flex-col items-center">

              <div
                className="
                  mb-3
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-slate-800
                  text-xl
                "
              >
                ✓
              </div>

              <p className="text-sm font-semibold text-slate-400">
                Nenhum agendamento pendente
              </p>

              <p className="mt-1 text-xs text-slate-600">
                A fila está vazia no momento.
              </p>

            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* MOBILE */}
<div className="md:hidden space-y-4">
  {data.length > 0 ? (
    data.map((cliente, index) => {
      const servico = servicos.find(
        (s) => Number(s.id) === Number(cliente.servico_id)
      );

      return (
        <div
          key={cliente._id}
          className="bg-white rounded-2xl shadow-md border border-slate-200 p-4"
        >
          {/* Cabeçalho do card */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-medium text-gray-400">
                CLIENTE #{index + 1}
              </span>

              <h3 className="text-lg font-bold text-gray-800 mt-1 break-words">
                {cliente.nome}
              </h3>
            </div>

            <div className="bg-slate-100 rounded-full px-3 py-1">
              <span className="text-sm font-semibold text-gray-600">
                {new Date(cliente.horario + "Z").toLocaleTimeString(
                  "pt-BR",
                  {
                    timeZone: "America/Sao_Paulo",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase">
                Serviço
              </p>

              {servico ? (
                <div className="flex items-center justify-between gap-3 mt-1">
                  <span className="font-medium text-gray-700">
                    {servico.nome}
                  </span>

                  <span className="font-semibold text-gray-700 whitespace-nowrap">
                    {Number(servico.preco).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-red-500">
                  Serviço não encontrado
                </span>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={() => onChamar(cliente)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-2.5 rounded-xl transition shadow-sm"
            >
              Chamar
            </button>

            <button
              onClick={() => onFinalizar(cliente)}
              className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold py-2.5 rounded-xl transition shadow-sm"
            >
              Finalizar
            </button>
          </div>
        </div>
      );
    })
  ) : (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 text-center">
      <p className="text-gray-500">
        Nenhum agendamento pendente
      </p>
    </div>
  )}
</div>
      {/* 
      <table className="w-full bg-white flex flex-col md:flex-row justify-between rounded-2xl shadow-md overflow-hidden mt-6">
        <div className="ml-4 mr-4">
          <div className="bg-gray-300/95 flex flex-col shadow-2xl rounded-2xl p-5 mb-65 w-full max-w-md gap-4 mt-5">
            <p className="text-lg font-semibold">
              Total de faturamento: R$ 0,00
            </p>
          </div>

          <div className="bg-gray-300/95 flex shadow-2xl rounded-2xl p-5 mb-65 w-full max-w-md gap-4 mt-5">
            <p className="text-lg font-semibold">Total de gastos: R$ 0,00</p>
          </div>
        </div>
      </table>
      */}
    </div>
  );
}
