"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FilaPage() {
  const [fila, setFila] = useState(null);
  const router = useRouter();

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const exit = async () => {
    try {
      const response = await fetch(`${API_URL}/agendamentos/sair/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.log("Erro ao sair da fila");
        return;
      }

      const data = await response.json();
      console.log(data);

      localStorage.clear();
      router.push("/agenda");

    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  useEffect(() => {
    let ativo = true;

    async function carregarFila() {
      try {
        const response = await fetch(
          `${API_URL}/agendamentos/fila/`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        if (ativo) {
          setFila(data);
        }

      } catch (error) {
        console.error("Erro ao carregar fila:", error);
      }
    }

    carregarFila();

    const interval = setInterval(carregarFila, 3000);

    return () => {
      ativo = false;
      clearInterval(interval);
    };
  }, []);

  if (!fila) return <p>Carregando...</p>;

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
