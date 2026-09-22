"use client";

import { useEffect, useState } from "react";
import AgendaRelatorio from "../../../components/Agenda/AgendaRelatorio";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RelatorioPage() {
  const [dadosRelatorio, setDadosRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    let ativo = true;

   const dadosPrestes = localStorage.getItem('user');

    // 2. Verifica se a chave realmente existe para evitar erros
    if (dadosPrestes) {
      // 3. Converte a string de volta para um objeto JavaScript
      const usuarioObjeto = JSON.parse(dadosPrestes);
      
      // 4. Pega a propriedade "usuario" (que contém "Mathues") e joga no estado
      setNomeUsuario(usuarioObjeto.usuario); 
    }

    async function carregarRelatorio() {
      try {
        setLoading(true);
        setErro("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/clientes/meu-historico`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar relatório.");
        }

        const data = await response.json();

        if (ativo) {
          setDadosRelatorio(data);
        }
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);

        if (ativo) {
          setErro("Não foi possível carregar o relatório.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarRelatorio();

    return () => {
      ativo = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando relatório...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{erro}</p>
      </div>
    );
  }

  return <AgendaRelatorio 
  dados={dadosRelatorio} 
  nomeUsuario={nomeUsuario}
  />
}