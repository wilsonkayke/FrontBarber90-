"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FilaForms from "../../components/Fila/FilaForms";

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
    <FilaForms 
      setFila={setFila}
      fila={fila}
      exit={exit}
    />
  );
}
