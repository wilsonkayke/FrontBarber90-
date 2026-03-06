export default function BarberTable({ data = [], onChamar, onFinalizar }) {
  return (
    <table className="w-full bg-white rounded-xl shadow">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="py-3 px-4">#</th>
          <th>Nome</th>
          <th>Horário</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((cliente, index) => (
            <tr key={cliente._id} className="border-b last:border-none">
              <td className="py-3 px-4">{index + 1}</td>

              <td>{cliente.nome}</td>

              <td>
                {new Date(cliente.horario + "Z").toLocaleTimeString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td className="flex gap-2 py-2">

                <button
                  onClick={onChamar}
                  className="bg-blue-500 hover:bg-blue-800 active:bg-red-700 text-white font-bold px-4 py-1 rounded transition-colors"
                >
                  Chamar
                </button>

                <button
                  onClick={onFinalizar}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Finalizar
                </button>

              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">
              Nenhum agendamento pendente
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}