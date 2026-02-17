"use client";
import { useEffect, useState } from "react";

export default function FilaPage() {
  const [fila, setFila] = useState(null);

  useEffect(() => {
    async function carregarFila() {
      try {
        const response = await fetch(
          "http://localhost:8000/agendamentos/fila",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) return;

        const data = await response.json();
        setFila(data);
      } catch (error) {
        console.error(error);
      }
    }

    carregarFila();

    const interval = setInterval(carregarFila, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"> 
        <h1 className="text-2xl font-bold text-center mb-6">
          Acompanhamento da Fila
        </h1>

        {!fila ? (
          <p className="text-center text-gray-600">Carregando...</p>
        ) : fila.posicao === null ? (
          <p className="text-center text-gray-600">Você não está na fila</p>
        ) : (
          <div className="space-y-3 text-center">
            <p className="text-lg font-semibold">
              Sua posição: {fila.posicao}°
            </p>
            <p>Pessoas à frente: {fila.pessoas_a_frente}</p>
            <p>Total na fila: {fila.total_na_fila}</p>
          </div>
        )}
      </div>
    </main>
  );
}
