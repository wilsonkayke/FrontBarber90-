"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgendaPage() {
  const router = useRouter();

  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  const [msgSucesso, setMsgSucesso] = useState("");
  const [msgErro, setMsgErro] = useState("");

  const handleAgendar = async (e) => {
  e.preventDefault();

  if (!data || !hora) {
    setMsgErro("Preencha todos os campos antes de agendar!");
    setMsgSucesso("");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const [ano, mes, dia] = data.split("-");
    const [horaSel, minutoSel] = hora.split(":");

    const dataLocal = new Date(
    Number(ano),
    Number(mes) - 1,
    Number(dia),
    Number(horaSel),
    Number(minutoSel)
  );

    const resposta = await fetch("http://localhost:8000/agendamentos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        horario: dataLocal.toISOString(),
      }),
    });

    if (!resposta.ok) {
    const erroBackend = await resposta.json();
    console.log("ERRO DO BACKEND:", erroBackend);
    throw new Error(erroBackend.detail || "Erro ao criar agendamento");
    }


    setMsgSucesso("Agendamento realizado com sucesso!");
    setMsgErro("");

    setData("");
    setHora("");

    setTimeout(() => {
      router.push("/fila");
    }, 2000);

  } catch (erro) {
    setMsgErro("Erro ao conectar com o servidor.");
    setMsgSucesso("");
  }
};


  return (
  <main className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

      {/* Título */}
      <h1 className="text-2xl font-bold mb-6 text-center">
        Agendamento da Fila
      </h1>

      {/* Card - Informações da Barbearia */}
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-1">Informações da Barbearia</h2>
        <p className="text-sm">
          Barbearia Barber space - Atendimento por ordem de chegada.
        </p>
        <p className="text-sm">Horário: 08h às 18h, quarta à sábado.</p>
      </div>

      {/* Card - Como funciona */}
      <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-blue-700 mb-2">
          Como funciona a fila digital?
        </h2>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Ao entrar na fila, você será adicionado ao final da lista.</li>
          <li>Sua posição será mostrada na tela de acompanhamento.</li>
          <li>A fila atualiza automaticamente conforme os atendimentos avançam.</li>
        </ul>
      </div>

      {/* Mensagens */}
      {msgErro && (
        <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">
          {msgErro}
        </div>
      )}

      {msgSucesso && (
        <div className="bg-green-100 text-green-600 p-2 mb-4 rounded">
          {msgSucesso}
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleAgendar} className="space-y-4">

        {/* Data */}
        <div>
          <label className="block text-sm font-medium">
            Data do Agendamento
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Hora */}
        <div>
          <label className="block text-sm font-medium">
            Horário
          </label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700"
        >
          Entrar na Fila
        </button>
      </form>

    </div>
  </main>
);
}
