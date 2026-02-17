export default function BarberTable({ data = [] }) {
  return (
    <table className="w-full bg-white rounded-xl shadow">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="py-3 px-4">#</th>
          <th>Nome</th>
          <th>Horário</th>
          <th>Ação</th>
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
              <td>
                <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                  Chamar
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
