"use client";

import { useEffect, useState } from "react";
import { LayoutBarber } from "../../components/barbeiro/LayoutBarber";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Barbeiro() {
  // ==============================
  // ESTADOS
  // ==============================

  const [data, setData] = useState([]);

  const [faturamentoHoje, setFaturamentoHoje] = useState(0);

  const [servicos, setServicos] = useState([]);

  const [dadosAtendimentos, setDadosAtendimentos] = useState([]);

  const [dadosServicos, setDadosServicos] = useState([]);

  const [diaSelecionado, setDiaSelecionado] = useState("hoje");

  const [datasDisponiveis, setDatasDisponiveis] = useState([]);

  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState(null);


  // ==============================
  // TOKEN
  // ==============================

  const obterToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token");
  };


  // ==============================
  // HEADERS
  // ==============================

  const getHeaders = () => {
    const token = obterToken();

    return {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    };
  };


  // ==============================
  // BUSCAR FILA / ATENDIMENTOS
  // ==============================

  const buscarAtendimentos = async () => {
  try {
    const response = await fetch(
      `${API_URL}/agendamentos/barbeiro/dashboard`,
      {
        headers: getHeaders(),
      }
    );

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(
        resultado?.detail || "Erro ao buscar atendimentos."
      );
    }

    console.log("Dashboard:", resultado);

    setData(resultado?.agendamentos || []);

  } catch (error) {
    console.error("Erro ao buscar atendimentos:", error);
    setErro(error.message);
  }
};


  // ==============================
  // BUSCAR FATURAMENTO
  // ==============================

  


  // ==============================
  // BUSCAR SERVIÇOS
  // ==============================

  


  // ==============================
  // RELATÓRIO DE ATENDIMENTOS
  // ==============================

  const buscarRelatorioAtendimentos = async () => {
    try {
      const response = await fetch(
        `${API_URL}/agendamentos/barbeiro/relatorio-atendimentos`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar relatório de atendimentos.");
      }

      const resultado = await response.json();

      setDadosAtendimentos(resultado?.relatorio || []);
    } catch (error) {
      console.error(
        "Erro ao buscar relatório de atendimentos:",
        error
      );
    }
  };


  // ==============================
  // RELATÓRIO DE SERVIÇOS
  // ==============================

  const buscarRelatorioServicos = async () => {
    try {
      const response = await fetch(
        `${API_URL}/agendamentos/barbeiro/relatorio-servicos`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar relatório de serviços.");
      }

      const resultado = await response.json();

      setDadosServicos(resultado?.relatorio || []);
    } catch (error) {
      console.error(
        "Erro ao buscar relatório de serviços:",
        error
      );
    }
  };


  // ==============================
  // DATAS DISPONÍVEIS
  // ==============================


  // ==============================
  // CARREGAMENTO INICIAL
  // ==============================

  
  // ==============================
  // ATUALIZAR QUANDO MUDAR O DIA
  // ==============================

  useEffect(() => {
    if (!carregando) {
      buscarAtendimentos();
    }
  }, [diaSelecionado]);


  // ==============================
  // CHAMAR CLIENTE
  // ==============================

  const handleChamar = async (cliente) => {
    try {
      const response = await fetch(
        `${API_URL}/agendamentos/barbeiro/chamar`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            agendamento_id: cliente.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao chamar cliente.");
      }

      await buscarAtendimentos();

    } catch (error) {
      console.error("Erro ao chamar cliente:", error);
    }
  };


  // ==============================
  // FINALIZAR ATENDIMENTO
  // ==============================

  const handleFinalizar = async (cliente) => {
    try {
      const response = await fetch(
        `${API_URL}/agendamentos/admin/finalizar`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            agendamento_id: cliente.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao finalizar atendimento.");
      }

      await Promise.all([
        buscarAtendimentos(),
        buscarFaturamento(),
        buscarRelatorioAtendimentos(),
        buscarRelatorioServicos(),
      ]);

    } catch (error) {
      console.error(
        "Erro ao finalizar atendimento:",
        error
      );
    }
  };


  // ==============================
  // RENDER
  // ==============================

  return (
    <LayoutBarber
      data={data}

      faturamentoHoje={faturamentoHoje}

      servicos={servicos}

      dadosAtendimentos={dadosAtendimentos}

      dadosServicos={dadosServicos}

      diaSelecionado={diaSelecionado}
      setDiaSelecionado={setDiaSelecionado}

      datasDisponiveis={datasDisponiveis}

      mostrarCalendario={mostrarCalendario}
      setMostrarCalendario={setMostrarCalendario}

      onChamar={handleChamar}
      onFinalizar={handleFinalizar}

      carregando={carregando}
      erro={erro}
    />
  );
}