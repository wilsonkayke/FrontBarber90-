"use client";

import { useEffect, useState } from "react";
import { LayoutBarber } from "../../components/barbeiro/LayoutBarber";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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
  // CARREGAMENTO INICIAL
  // ==============================

  useEffect(() => {
    const carregarDados = async () => {
      await Promise.all([
        buscarAtendimentos()
      ]);
    };

    carregarDados();
  }, []);

  // ==============================
  // Gerar datas disponíveis
  // ==============================

  const gerarDatasDisponiveis = (agendamentos) => {
    const agrupamento = {};

    agendamentos.forEach((item) => {
      if (!item.horario) return;

      const data = new Date(item.horario).toLocaleDateString("sv-SE", {
        timeZone: "America/Sao_Paulo",
      });

      if (!agrupamento[data]) {
        agrupamento[data] = 0;
      }

      agrupamento[data]++;
    });

    return Object.entries(agrupamento)
      .map(([data, quantidade]) => ({
        data,
        quantidade,
      }))
      .sort((a, b) => a.data.localeCompare(b.data));
  };

  // ==============================
  // BUSCAR FILA / ATENDIMENTOS
  // ==============================

  const buscarAtendimentos = async () => {
    try {
      const response = await fetch(
        `${API_URL}/barbeiros/barbeiro/dashboard`,
        {
          headers: getHeaders(),
        },
      );

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado?.detail || "Erro ao buscar atendimentos.");
      }

      const agendamentos = resultado?.agendamentos || [];

      setData(agendamentos);
      setDatasDisponiveis(gerarDatasDisponiveis(agendamentos));
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };  

  // ==============================
  // RELATÓRIO DE SERVIÇOS
  // ==============================

  const buscarRelatorio = async () => {
  try {
    const response = await fetch(
      `${API_URL}/agendamentos/admin/dashboard/relatorio-atendimentos`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const erro = await response.text();
      console.log("ERRO AO BUSCAR RELATÓRIO:", erro);
      return;
    }

    const resultado = await response.json();

    setFaturamentoHoje(resultado?.faturamentoHoje || 0);
    setDadosAtendimentos(resultado?.relatorio || []);
  } catch (error) {
    console.error("Erro ao buscar relatório:", error);
  }
};

  const handleChamar = async (cliente) => {
  try {
    const response = await fetch(
      `${API_URL}/barbeiros/barbeiro/chamar`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          agendamento_id: cliente._id,
        }),
      }
    );

    if (!response.ok) {
      const erro = await response.text();
      console.log("ERRO AO CHAMAR CLIENTE:", erro);
      return;
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
      `${API_URL}/barbeiros/barbeiro/finalizar`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          agendamento_id: cliente._id,
        }),
      }
    );

    if (!response.ok) {
      const erro = await response.text();
      console.log("ERRO AO FINALIZAR ATENDIMENTO:", erro);
      return;
    }

    await Promise.all([
      buscarAtendimentos(),
      buscarRelatorio(),
    ]);

  } catch (error) {
    console.error("Erro ao finalizar atendimento:", error);
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
