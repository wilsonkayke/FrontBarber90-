"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgendaPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  const [msgSucesso, setMsgSucesso] = useState("");
  const [msgErro, setMsgErro] = useState("");

  const handleAgendar = (e) => {
    e.preventDefault();

    if (!nome || !email || !data || !hora) {
      setMsgErro("Preencha todos os campos antes de agendar!");
      setMsgSucesso("");
      return;
    }

    // salva os agendamentos no localStorage
    let listaAgendamentos = JSON.parse(localStorage.getItem("listaAgendamentos") || "[]");

    listaAgendamentos.push({
      nome,
      email,
      data,
      hora,
    });

    localStorage.setItem("listaAgendamentos", JSON.stringify(listaAgendamentos));

    setMsgSucesso("Agendamento realizado com sucesso!");
    setMsgErro("");

    // limpa os campos
    setNome("");
    setEmail("");
    setData("");
    setHora("");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Agendamento</h1>

        {msgErro && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{msgErro}</div>
        )}
        {msgSucesso && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 rounded">
            {msgSucesso}
          </div>
        )}

        <form onSubmit={handleAgendar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Data:</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Hora:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Agendar
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => router.push("/cortes")}
            className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
          >
            Cortes
          </button>
        </div>
      </div>
    </main>
  );
}
