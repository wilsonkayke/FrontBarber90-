"use client";

import { useEffect, useState } from "react";
import Footer from "../Agenda/Footer";
import DCliente from "./DCliente";

export default function FilaForms({
  fila,
  exit,
  sair,
  nomeUser,
  agendamento,
  prazoExpirado,
  novoAgendamento,
}) {
  const imagens = [
    "/imagens/Reflexo.jpg",
    "/imagens/Nevou.jpg",
    "/imagens/Moicano.jpg",
  ];

  const [index, setIndex] = useState(0);

  const proximo = () => {
    setIndex((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  };

  const anterior = () => {
    setIndex((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  };

  const foiChamado = agendamento?.status === "chamado";

  const emAtendimento = agendamento?.status === "em_atendimento";

  const [tempoRestante, setTempoRestante] = useState(null);

  useEffect(() => {
    if (!foiChamado || !agendamento?.prazo_chamada) {
      setTempoRestante(null);
      return;
    }

    const prazo = new Date(agendamento.prazo_chamada).getTime();

    if (Number.isNaN(prazo)) {
      setTempoRestante(null);
      return;
    }

    const atualizarTempo = () => {
      const segundos = Math.max(0, Math.ceil((prazo - Date.now()) / 1000));

      setTempoRestante(segundos);
    };

    atualizarTempo();

    const intervalo = setInterval(atualizarTempo, 1000);

    return () => clearInterval(intervalo);
  }, [foiChamado, agendamento?.prazo_chamada]);

  const formatarTempo = (segundos) => {
    if (segundos === null) return "--:--";

    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return `${String(minutos).padStart(2, "0")}:${String(
      segundosRestantes,
    ).padStart(2, "0")}`;
  };

  return (
    // CONTÊINER PRINCIPAL: Ocupa no mínimo a tela inteira e define o fluxo flex vertical
    <div
      style={{
        backgroundImage: "url('/imagens/principal.jpg')",
      }}
      className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col justify-between"
    >
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 mt-5">
        <div className="bg-gray-400/95 flex flex-col shadow-2xl rounded-2xl p-5 w-full max-w-5xl backdrop-blur-sm gap-4">
          <h1 className="text-white text-2xl font-bold text-center mb-6">
            Acompanhamento da Fila
          </h1>

          <DCliente agendamento={agendamento} />

          {prazoExpirado && !agendamento ? (
            <div className="bg-amber-800/90 rounded-2xl p-6 text-center space-y-4">
              <h2 className="text-white text-2xl font-bold">
                ⏳ Você perdeu sua vez!
              </h2>

              <p className="text-amber-100">
                Você não confirmou sua presença dentro dos 15 minutos
                disponíveis.
              </p>

              <p className="text-white text-sm">
                Realize um novo agendamento para entrar novamente na fila.
              </p>

              <button
                onClick={novoAgendamento}
                className="bg-green-700 hover:bg-green-800 text-white
                 font-semibold px-6 py-3 rounded-xl transition"
              >
                Realizar novo agendamento
              </button>
            </div>
          ) : !fila ? (
            <p className="text-center text-gray-600">Carregando...</p>
          ) : foiChamado ? (
            <div className="bg-green-700/90 rounded-2xl p-6 text-center space-y-3">
              <h2 className="text-white text-2xl font-bold">
                🔔 Você foi chamado!
              </h2>

              <p className="text-white">O barbeiro está aguardando você.</p>

              <p className="text-green-100 text-sm">
                Dirija-se ao atendimento.
              </p>

              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-green-100 text-sm">
                  Tempo restante para comparecer
                </p>

                <p className="text-white text-4xl font-bold mt-2">
                  {formatarTempo(tempoRestante)}
                </p>
              </div>

              {tempoRestante === 0 && (
                <p className="text-yellow-200 text-sm">
                  Você perdeu sua vez por não confirmar a presença dentro dos 15
                  minutos.
                </p>
              )}
            </div>
          ) : emAtendimento ? (
            <div className="bg-blue-800/90 rounded-2xl p-6 text-center space-y-3">
              <h2 className="text-white text-2xl font-bold">
                ✅ Presença confirmada!
              </h2>

              <p className="text-blue-100">Seu atendimento foi iniciado.</p>

              <p className="text-white text-sm">Bom atendimento!</p>
            </div>
          ) : fila.posicao === null ? (
            <p className="text-center font-bold text-white">
              Você não está na fila no momento.
            </p>
          ) : (
            <div className="bg-gray-600/70 backdrop-blur-sm rounded-2xl space-y-3 text-center">
              <p className="text-white font-semibold mt-4">
                Sua posição: {fila.posicao}°
              </p>

              <p className="text-white font-bold">
                Pessoas à frente: {fila.pessoas_a_frente}
              </p>

              <p className="text-white font-bold">
                Total na fila: {fila.total_na_fila}
              </p>

              <div className="border-t border-gray-100 pt-4 mt-4" />

              <button
                onClick={exit}
                className="bg-red-700 text-white px-4 py-2 mb-4 rounded-xl hover:bg-red-800 transition"
              >
                Sair da fila
              </button>
            </div>
          )}
        </div>
      </main>
      <div>
        <Footer />
      </div>
    </div> // Fecha o contêiner principal corretamente
  ); // Fecha o return
} // Fecha a função FilaForms
