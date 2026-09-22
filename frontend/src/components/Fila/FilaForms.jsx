"use client";

import { useState } from "react";
import AgendaTopbar from "../Agenda/AgendaTopbar";
import Footer from "../Agenda/Footer";
import DCliente from "./DCliente";

export default function FilaForms({ fila, exit, sair, nomeUser, agendamento }) {
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

  return (
    // CONTÊINER PRINCIPAL: Ocupa no mínimo a tela inteira e define o fluxo flex vertical
    <div
      style={{
        backgroundImage: "url('/imagens/principal.jpg')",
      }}
      className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col justify-between"
    >
      <AgendaTopbar nomeUser={nomeUser} />
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 mt-5">
        <div className="bg-gray-400/95 flex flex-col shadow-2xl rounded-2xl p-5 w-full max-w-5xl backdrop-blur-sm gap-4">
          <h1 className="text-white text-2xl font-bold text-center mb-6">
            Acompanhamento da Fila
          </h1>

          <DCliente agendamento={agendamento} />

          {!fila ? (
            <p className="text-center text-gray-600">Carregando...</p>
          ) : fila.posicao === null ? (
            <p className="text-center font-bold text-white">Você foi chamado</p>
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

              <div className="border-t border-gray-100 pt-4 mt-4"></div>

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
