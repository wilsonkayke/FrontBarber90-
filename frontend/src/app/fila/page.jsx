"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FilaForms from "../../components/Fila/FilaForms";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FilaPage() {
  const [fila, setFila] = useState(null);
  const [agendamento, setAgendamento] = useState(null);
  const [nomeUser, setNomeUser] = useState("");

  const router = useRouter();

  // Guarda o ID do agendamento mais recente
  const agendamentoIdRef = useRef(null);

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
        console.error("Erro ao sair da fila");
        return;
      }

      router.push("/agenda");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  useEffect(() => {
    const dadosSalvo = localStorage.getItem("user");

    if (!dadosSalvo) return;

    try {
      const usuarioObjeto = JSON.parse(dadosSalvo);
      setNomeUser(usuarioObjeto.usuario || "");
    } catch (erro) {
      console.error("Erro ao analisar o usuário:", erro);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function carregarFila() {
      try {
        const response = await fetch(`${API_URL}/fila`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Erro ao carregar fila:", response.status);
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
        const response = await fetch(
          `${API_URL}/agendamentos/meu-agendamento`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          console.error("Erro ao carregar agendamento:", response.status);
          return;
        }

        const data = await response.json();

        if (ativo) {
          const atual = data.agendamento ?? null;

          setAgendamento(atual);

          agendamentoIdRef.current = atual?._id
            ? String(atual._id)
            : atual?.id
              ? String(atual.id)
              : null;
        }
      } catch (error) {
        console.error("Erro ao carregar agendamento:", error);
      }
    }

    async function carregarDados() {
      await Promise.all([carregarFila(), carregarAgendamento()]);
    }

    // Carregamento inicial
    carregarDados();

    // WebSocket

    const wsUrl = API_URL.replace(/^http/, "ws");

    let socket = null;
    let reconnectTimer = null;
    let tentativas = 0;

    function conectarWebSocket() {

      if (!ativo || pausaTeste) return;

      // Evita abrir duas conexões simultâneas
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }

      if (process.env.NODE_ENV === "development") {
        window.testarQuedaWebSocket = () => {
          if (socket) {
            console.log("🧪 Simulando queda do WebSocket");
            socket.close(4000, "Teste de reconexão");
          }
        };
      }
      const novaConexao = new WebSocket(`${wsUrl.replace(/\/$/, "")}/ws/fila`);

      socket = novaConexao;

      novaConexao.onopen = () => {
        if (!ativo || socket !== novaConexao) return;

      //  console.log("✅ WebSocket aberto");

        novaConexao.send(JSON.stringify({ token }));

        tentativas = 0;

        // Sincroniza os dados após reconectar
        carregarDados();
      };

      novaConexao.onmessage = async (event) => {
        if (!ativo || socket !== novaConexao) return;

        try {
          const mensagem = JSON.parse(event.data);

        //  console.log("📩 Evento WebSocket:", mensagem);

          if (
            !["cliente_chamado", "atendimento_finalizado"].includes(
              mensagem.tipo,
            )
          ) {
            return;
          }

          const idAtual = agendamentoIdRef.current;

          if (idAtual && String(mensagem.agendamento_id) !== idAtual) {
            return;
          }

          await carregarDados();
        } catch (error) {
          console.warn("Falha ao processar mensagem WebSocket:", error);
        }
      };

      novaConexao.onerror = () => {
        console.warn("⚠️ Falha na conexão WebSocket.");
      };

      novaConexao.onclose = (event) => {
        if (!ativo || socket !== novaConexao) return;

      //  console.warn(`WebSocket fechado. Código: ${event.code}`);

        socket = null;

        // Se estivermos simulando uma desconexão,
        // não iniciar reconexão automática.

        if (event.code === 1008) {
          console.warn("Autenticação WebSocket rejeitada.");
          return;
        }

        tentativas += 1;

        const atraso = Math.min(1000 * 2 ** (tentativas - 1), 30000); 

        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          conectarWebSocket();
        }, atraso);
      };
    }

    conectarWebSocket();

    // Polling temporário para recuperação de estado
    //const interval = setInterval(carregarDados, 3000);

    return () => {
      ativo = false;

      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
      }

      if (socket) {
        socket.close(1000, "Página encerrada");
        socket = null;
      }

    };
  }, [router]);

  if (!fila) {
    return <p>Carregando...</p>;
  }

  return (
    <FilaForms
      setFila={setFila}
      fila={fila}
      exit={exit}
      sair={() => window.location.replace("/")}
      nomeUser={nomeUser}
      agendamento={agendamento}
    />
  );
}
