"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FilaPage() {
  const [fila, setFila] = useState(null);
  const router = useRouter();

 const exit = async () => {
  try {
    const response = await fetch("http://localhost:8000/agendamentos/sair", {
      method: "DELETE", // <-- CORRIGIDO
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    console.log(data);

    localStorage.clear();
    router.push("/agenda");

  } catch(error) {
    console.error(error);
  }
};

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
    <main className="flex items-center justify-center min-h-screen bg-linear-to-r from-blue-100 to-gray-800">
      <div className="bg-gray-100 shadow-lg rounded-xl p-8 w-full max-w-md"> 
        <h1 className="text-2xl font-bold text-center mb-6">
          Acompanhamento da Fila
        </h1>

        {!fila ? (
          <p className="text-center text-gray-600">Carregando...</p>
        ) : fila.posicao === null ? (
          <p className="text-center text-gray-600">Você foi chamado</p>
        ) : (
          <div className="space-y-3 text-center">
            <p className="text-lg font-semibold">
              Sua posição: {fila.posicao}°
            </p>
            <p>Pessoas à frente: {fila.pessoas_a_frente}</p>
            <p>Total na fila: {fila.total_na_fila}</p>
            <button 
              onClick={exit}
              className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
              Sair
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
