"use client";

export default function BarberTable({
  data = [],
  onChamar,
  onFinalizar,
  diaSelecionado,
  setDiaSelecionado,
  servicos = [],
  datasDisponiveis = [],
  mostrarCalendario,
  setMostrarCalendario,
}) {
  return (
    <div className="relative overflow-x-auto">
      {/* Filtros */}
      <div className="flex gap-4 mb-4 flex-1">
        {/* Calendário */}
        <div className="">
          <button
            onClick={() => setMostrarCalendario(!mostrarCalendario)}
            className={`
              cursor-pointer
              p-4
              rounded-2xl
              w-35
              text-center
              font-bold
              transition
              ${
                mostrarCalendario
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-gray-700"
              }
            `}
          >
            📅 Calendário
          </button>

          {mostrarCalendario && (
            <div className="absolute top-10 left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
              {datasDisponiveis.length > 0 ? (
                datasDisponiveis.map((item) => (
                  <button
                    key={item.data}
                    onClick={() => {
                      setDiaSelecionado(item.data);
                      setMostrarCalendario(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b last:border-none"
                  >
                    <div className="font-medium">📅 {item.data}</div>

                    <div className="text-sm text-gray-500">
                      {item.quantidade} agendamento(s)
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500">
                  Nenhuma data encontrada
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hoje */}
        <div
          onClick={() => {
            setDiaSelecionado("hoje");
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
              diaSelecionado === "hoje"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-gray-700"
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
            cursor-pointer
            p-4
            rounded-2xl
            w-32
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
<div className="hidden md:block overflow-hidden rounded-2xl shadow-md border border-slate-200">
  <table className="w-full bg-white table-fixed">
    <thead>
      <tr className="bg-slate-200 text-left text-gray-700">
        <th className="py-4 px-4 w-[8%]">#</th>
        <th className="py-4 px-4 w-[22%]">Nome</th>
        <th className="py-4 px-4 w-[28%] text-center">Serviço</th>
        <th className="py-4 px-4 w-[17%] text-center">Horário</th>
        <th className="py-4 px-4 w-[25%] text-center">Ações</th>
      </tr>
    </thead>

    <tbody>
      {data.length > 0 ? (
        data.map((cliente, index) => {
          const servico = servicos.find(
            (s) => Number(s.id) === Number(cliente.servico_id)
          );

          return (
            <tr
              key={cliente._id}
              className="border-b border-slate-100 hover:bg-slate-50 transition"
            >
              <td className="py-4 px-4 font-semibold text-gray-500">
                {index + 1}
              </td>

              <td className="py-4 px-4 font-semibold text-gray-700 break-words">
                {cliente.nome}
              </td>

              <td className="py-4 px-4 text-gray-600 text-center break-words">
                {servico ? (
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-gray-700">
                      {servico.nome}
                    </span>

                    <span className="text-sm text-gray-500">
                      {Number(servico.preco).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-red-500">
                    Serviço não encontrado
                  </span>
                )}
              </td>

              <td className="py-4 px-4 text-gray-600 text-center font-medium">
                {new Date(cliente.horario + "Z").toLocaleTimeString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td className="py-4 px-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onChamar(cliente)}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm"
                  >
                    Chamar
                  </button>

                  <button
                    onClick={() => onFinalizar(cliente)}
                    className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm"
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
            className="text-center py-10 text-gray-500"
          >
            Nenhum agendamento pendente
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
