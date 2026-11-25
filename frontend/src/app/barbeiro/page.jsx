"use client";

import { useEffect, useState } from "react";
import { LayoutBarber } from "../../components/barbeiro/LayoutBarber";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const WS_URL = API_URL.replace(/^http/, "ws").replace(/\/$/, "");

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
  const [confirmandoPresenca, setConfirmandoPresenca] = useState(false);
  const [erroPresenca, setErroPresenca] = useState(null);

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

  const dadosGraficoAtendimentos = dadosAtendimentos.map((item) => ({
    data: item.data
      ? item.data.split("-").reverse().slice(0, 2).join("/")
      : "N/A",

    atendimentos: item.total_finalizados || 0,
  }));

  const dadosGraficoServicos = dadosAtendimentos.reduce((acumulado, dia) => {
    dia.servicos?.forEach((servico) => {
      // Consideramos somente serviços finalizados
      if (servico.status !== "finalizado") return;

      const existente = acumulado.find(
        (item) => item.servico_id === servico.servico_id,
      );

      if (existente) {
        existente.quantidade += servico.total;
      } else {
        acumulado.push({
          servico_id: servico.servico_id,
          quantidade: servico.total,
          nome:
            servicos.find(
              (item) => Number(item.id) === Number(servico.servico_id),
            )?.nome || "Serviço desconhecido",
        });
      }
    });

    return acumulado;
  }, []);

  const DICIONARIO_SERVICOS = [
    { id: 1, nome: "Corte de cabelo", duracao: "15 minutos", preco: 30 },
    { id: 2, nome: "Barba", duracao: "10 minutos", preco: 15 },
    { id: 3, nome: "Corte e barba", duracao: "20 minutos", preco: 45 },
    { id: 4, nome: "Corte infantil", duracao: "20 minutos", preco: 25 },
    { id: 5, nome: "Sobrancelha", duracao: "5 minutos", preco: 5 },
  ];

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
  // FUNÇÃO GLOBAL DE BUSCA (Ajustada)
  // ==============================
  const buscarAtendimentos = async (isFirstLoad = false) => {
    try {
      if (isFirstLoad) setCarregando(true);

      const response = await fetch(`${API_URL}/barbeiros/barbeiro/dashboard`, {
        headers: getHeaders(),
      });

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
        },
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

  // ==============================
  // CARREGAMENTO INICIAL
  // ==============================
  useEffect(() => {
    buscarAtendimentos(true);
    buscarRelatorio();
  }, []);

  // ==============================
  // WEBSOCKET DO BARBEIRO
  // ==============================
  useEffect(() => {
    const token = obterToken();

    if (!token) {
      console.error("Token do barbeiro não encontrado.");
      return;
    }

    const socket = new WebSocket(`${WS_URL}/ws/barbeiro`);

    socket.onopen = () => {
      console.log("WebSocket do barbeiro conectado.");

      socket.send(
        JSON.stringify({
          token: token,
        }),
      );
    };

    socket.onmessage = async (event) => {
      try {
        const mensagem = JSON.parse(event.data);

        console.log("Evento recebido pelo WebSocket BARBEIRO:", mensagem);

        switch (mensagem.tipo) {
          case "novo_agendamento":
            console.log("Novo agendamento recebido:", mensagem.agendamento_id);

            await buscarAtendimentos();
            break;

          case "prazo_expirado":
            console.log("Cliente não compareceu:", mensagem.agendamento_id);

            await buscarAtendimentos();
            break;

          case "cliente_desistiu":
            console.log("Cliente desistiu:", mensagem.agendamento_id);

            await buscarAtendimentos();
            break;

          default:
            console.log("Evento WebSocket não tratado:", mensagem.tipo);
        }
      } catch (error) {
        console.error("Erro ao processar evento WebSocket:", error);
      }
    };

    socket.onerror = (error) => {
      console.warn("Erro no WebSocket BARBEIRO:", {
        evento: error.type,
        estado: socket.readyState,
        url: socket.url,
      });
    };

    socket.onclose = (event) => {
      console.log("WebSocket BARBEIRO fechado:", {
        codigo: event.code,
        motivo: event.reason,
        encerramentoNormal: event.wasClean,
      });
    };

    return () => {
      socket.close();
    };
  }, []);

  // ==============================
  // CHAMAR CLIENTE
  // ==============================
  const handleChamar = async () => {
    try {
      const response = await fetch(`${API_URL}/barbeiros/barbeiro/chamar`, {
        method: "POST",
        headers: getHeaders(),
      });

      const resultado = await response.json();

      if (!response.ok) {
        console.error("Status HTTP:", response.status);
        console.error("Detalhes do erro:", resultado.detail);
        return;
      }

      console.log("Cliente chamado:", resultado);

      await buscarAtendimentos();
    } catch (error) {
      console.error("Falha de comunicação com o backend:", error);
    }
  };


  
const handleConfirmarPresenca = async (cliente) => {
  if (confirmandoPresenca) return;

  try {
    setConfirmandoPresenca(true);
    setErroPresenca(null);

    const response = await fetch(
      `${API_URL}/barbeiros/barbeiro/confirmar-presenca`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          agendamento_id: cliente._id,
        }),
      }
    );

    const resultado = await response.json();

    if (!response.ok) {
      setErroPresenca(
        resultado.detail || "Erro ao confirmar presença."
      );

      console.warn("Erro ao confirmar presença:", resultado.detail);

      await buscarAtendimentos();
      return;
    }

    console.log("Presença confirmada:", resultado);

    await buscarAtendimentos();

  } catch (error) {
    setErroPresenca("Falha de comunicação com o servidor.");
    console.error("Erro ao confirmar presença:", error);

  } finally {
    setConfirmandoPresenca(false);
  }
};


  // ==============================
  // FINALIZAR ATENDIMENTO
  // ==============================
  const handleFinalizar = async (cliente) => {
    try {
      const response = await fetch(`${API_URL}/barbeiros/barbeiro/finalizar`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          agendamento_id: cliente._id,
        }),
      });

      if (!response.ok) {
        const erro = await response.text();
        console.log("ERRO AO FINALIZAR ATENDIMENTO:", erro);
        return;
      }

      await Promise.all([buscarAtendimentos(), buscarRelatorio()]);
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
      dicionarioServicos={DICIONARIO_SERVICOS}
      dadosAtendimentos={dadosGraficoAtendimentos}
      dadosServicos={dadosGraficoServicos}
      diaSelecionado={diaSelecionado}
      setDiaSelecionado={setDiaSelecionado}
      datasDisponiveis={datasDisponiveis}
      mostrarCalendario={mostrarCalendario}
      setMostrarCalendario={setMostrarCalendario}
      onChamar={handleChamar}
      onConfirmarPresenca={handleConfirmarPresenca}
      confirmandoPresenca={confirmandoPresenca}
      erroPresenca={erroPresenca}
      onFinalizar={handleFinalizar}
      carregando={carregando}
      erro={erro}
    />
  );
}
