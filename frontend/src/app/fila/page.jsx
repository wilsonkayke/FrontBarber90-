"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FilaForms from "../../components/Fila/FilaForms";
import DCliente from "../../components/Fila/DCliente";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FilaPage() {
  const [fila, setFila] = useState(null);
  const [agendamento, setAgendamento] = useState(null);
  const [nomeUser, setNomeUser] = useState("");
  const router = useRouter(); 

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const exit = async () => {
    try {
      console.log("Saindo da fila...");

      const response = await fetch(`${API_URL}/fila/agendamentos/sair`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.log("Erro ao sair da fila");
        return;
      }

      const data = await response.json();
      console.log(data);

      router.push("/agenda");
    } catch (error) { 
      console.error("Erro ao sair:", error);
    }
  };

  useEffect(() => {
    const nome = localStorage.getItem("usuario");

    if (nome) {
      setNomeUser(nome);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarFila() {
      try { 
        console.log("TOKEN:", localStorage.getItem("token"));
        console.log("API_URL:", API_URL);

        const response = await fetch(`${API_URL}/fila`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          console.log("STATUS:", response.status);

          const erro = await response.text();

          console.log("ERRO:", erro);
          return;
        }

        const data = await response.json();

        if (ativo) {
          setFila(data);
        } 
      } catch (error) {
        console.error("Erro ao carregar fila:", error);
      }
    }

    async function carregarAgendamento() {
  try {
    const token = localStorage.getItem("token");  

    const response = await fetch(
      `${API_URL}/agendamentos/meu-agendamento`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("STATUS AGENDAMENTO:", response.status);

    if (!response.ok) {
      const erro = await response.text();
      console.log("ERRO AGENDAMENTO:", erro);
      return;
    }

    const data = await response.json();

    setAgendamento(data.agendamento);
  } catch (error) {
    console.error("ERRO AO CARREGAR AGENDAMENTO:", error);
  }
}

    carregarFila();
    carregarAgendamento();

    const interval = setInterval(carregarFila, 3000);

    return () => {
      ativo = false;
      clearInterval(interval);
    };
  }, []);

  if (!fila) return <p>Carregando...</p>;

  return (
    <>
      <FilaForms
        setFila={setFila}
        fila={fila}
        exit={exit}
        sair={() => window.location.replace("/")}
        nomeUser={nomeUser}
        agendamento={agendamento}
      />
    </>
  );
}
