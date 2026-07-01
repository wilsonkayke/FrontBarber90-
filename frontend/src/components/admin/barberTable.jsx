"use client";

export default function BarberTable({
  data = [],
  onChamar,
  onFinalizar,
  diaSelecionado,
  setDiaSelecionado,
  datasDisponiveis = [],
  mostrarCalendario,
  setMostrarCalendario,
}) {
  return (
    <div className="overflow-x-auto">

      {/* Filtros */}
      <div className="flex gap-4 mb-4 flex-wrap">

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
            w-35
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
            w-35
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

        {/* Calendário */}
        <div className="relative"> 
          <button
            onClick={() =>
              setMostrarCalendario(!mostrarCalendario)
            }
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
          📅  Calendário
          </button>

          {mostrarCalendario && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">

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
                    <div className="font-medium">
                     📅 {item.data}
                    </div>

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
            w-35
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

      <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
 
        <thead>

          <tr className="bg-slate-300 text-left text-gray-700">

            <th className="py-4 px-4">#</th>

            <th>Nome</th>

            <th>Horário</th>

            <th className="px-14">Ações</th>

          </tr>

        </thead>

        <tbody>

          {data.length > 0 ? (

            data.map((cliente, index) => (

              <tr
                key={cliente._id}
                className="border-b hover:bg-slate-50 transition"
              >

                <td className="py-4 px-4 font-medium">
                  {index + 1}
                </td>

                <td className="font-medium text-gray-700">
                  {cliente.nome}
                </td>

                <td className="text-gray-600">
                  {new Date(cliente.horario + "Z").toLocaleTimeString(
                    "pt-BR",
                    {
                      timeZone: "America/Sao_Paulo",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </td>

                <td className="flex gap-2 py-3">

                  <button
                    onClick={onChamar}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-4 py-2 rounded-lg transition"
                  >
                    Chamar
                  </button>

                  <button 
                    onClick={onFinalizar}
                    className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-medium px-4 py-2 rounded-lg transition"
                  >
                    Finalizar
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="4"
                className="text-center py-6 text-gray-500"
              >
                Nenhum agendamento pendente
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
} 