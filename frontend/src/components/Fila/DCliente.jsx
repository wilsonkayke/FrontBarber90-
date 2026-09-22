"use client";

import { CheckCircle } from "lucide-react";

export default function DCliente({ agendamento }) {
  if (!agendamento) {
    return (
      <div className="flex items-center justify-center bg-gray-600/70 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl w-full max-w-5xl mx-auto mb-6">
        <p className="text-white">Carregando agendamento...</p>
      </div>
    );
  }

  const dataHorario = new Date(`${agendamento.horario}Z`);

  const dataFormatada = dataHorario.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const horarioFormatado = dataHorario.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });

  const precoFormatado =
    agendamento.preco !== undefined
      ? Number(agendamento.preco).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "Carregando...";

  return (
    <div className="flex items-center justify-center bg-gray-600/70 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl w-full max-w-5xl mx-auto mb-6">
      <div className="flex flex-col gap-4 w-full">
        
        <h2 className="font-semibold text-white flex items-center gap-2">
          <CheckCircle size={20} className="text-green-500" />
          Detalhes do agendamento
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-white">
          
          <div>
            <p className="text-gray-300">Cliente</p>
            <p className="font-semibold">
              {agendamento.nome_cliente || "Carregando..."}
            </p>
          </div>

          <div>
            <p className="text-gray-300">Serviço</p>
            <p className="font-semibold">
              {agendamento.servico || "Carregando..."}
            </p>
          </div>

          <div>
            <p className="text-gray-300">Data</p>
            <p className="font-semibold">
              {dataFormatada}
            </p>
          </div>

          <div>
            <p className="text-gray-300">Horário</p>
            <p className="font-semibold">
              {horarioFormatado}
            </p>
          </div>

          <div>
            <p className="text-gray-300">Preço</p>
            <p className="font-semibold">
              {precoFormatado}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}