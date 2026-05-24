export default function BarberTable({ data = [], onChamar, onFinalizar }) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden">

        <thead>
          <tr className="bg-slate-100 text-left text-gray-700">

            <th className="py-4 px-4">#</th>
            <th>Nome</th>
            <th>Horário</th>
            <th className="pr-4 px-14">Ações</th>

          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((cliente, index) => (
              <tr
                key={cliente._id}
                className="border-b last:border-none hover:bg-slate-50 transition"
              >
                <td className="py-4 px-4 font-medium">
                  {index + 1}
                </td>

                <td className="font-medium text-gray-700">
                  {cliente.nome}
                </td>

                <td className="text-gray-600">
                  {new Date(
                    cliente.horario + "Z"
                  ).toLocaleTimeString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="flex gap-2 py-3 pr-4">

                  {/* Chamar */}
                  <button
                    onClick={onChamar}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-4 py-2 rounded-lg transition"
                  >
                    Chamar
                  </button>

                  {/* Finalizar */}
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