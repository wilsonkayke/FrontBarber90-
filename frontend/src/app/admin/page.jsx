"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import BarberTable from "../../components/admin/barberTable"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState(null);
  const [autorizado, setAutorizado] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState("hoje");
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const [dadosFaturamento, setDadosFaturamento] = useState(null);

  const [dadosRelatorioBrutos, setDadosRelatorioBrutos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const depoisDeAmanha = new Date(amanha);
  depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 1);

  const dadosFiltrados = Array.isArray(dashboard?.agendamentos)
  ? dashboard.agendamentos.filter((cliente) => {
      const dataAgendamento = new Date(cliente.horario);
      dataAgendamento.setHours(0, 0, 0, 0);

      if (diaSelecionado === "hoje") {
        return dataAgendamento.getTime() === hoje.getTime();
      }

      if (diaSelecionado === "amanha") {
        return dataAgendamento.getTime() === amanha.getTime();
      }

      if (diaSelecionado === "todos") {
        return true;
      }

      // Data escolhida pelo calendário (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(diaSelecionado)) {
        return cliente.horario.slice(0, 10) === diaSelecionado;
      }

      return false;
    })
  : [];

  const dadosRelatorioFiltrados = dadosRelatorioBrutos.filter((item) => {
    if (filtroStatus === "finalizados") return item.total_finalizados > 0;
    if (filtroStatus === "cancelados") return item.total_cancelados > 0;
    return true; // "todos"
  })

  const datasDisponiveis = dashboard?.agendamentos
  ? Object.values(
      dashboard.agendamentos.reduce((acc, agendamento) => {

        const data = new Date(agendamento.horario)
          .toISOString()
          .split("T")[0];

        if (!acc[data]) {
          acc[data] = {
            data,
            quantidade: 0,
          };
        }

        acc[data].quantidade++;

        return acc;

      }, {})
    )
  : [];

  const servicos = [
    {
      id: 1,
      nome: "Corte de cabelo",
      duracao: "15 minutos",
      preco: 30,
    },
    {
      id: 2,
      nome: "Barba",
      duracao: "10 minutos",
      preco: 15,
    },
    {
      id: 3,
      nome: "Corte e barba",
      duracao: "30 minutos",
      preco: 40,
    },
    {
      id: 4,
      nome: "Corte infantil",
      duracao: "20 minutos",
      preco: 25,
    },
    {
      id: 5,
      nome: "Sobrancelha",
      duracao: "5 minutos",
      preco: 5,
    },
  ];

  // 🔐 Helper de autenticação
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };  

  // 🔐 Verifica se é admin
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.replace("/agenda");
      return;
    }

    setAutorizado(true);
  }, []);

  // 🔌 WebSocket do administrador
useEffect(() => {
  if (!autorizado) return;

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token não encontrado.");
    return;
  }

  const socket = new WebSocket("ws://127.0.0.1:8000/ws/admin");

  socket.onopen = () => { 

    socket.send(
      JSON.stringify({
        token: token,
      })
    );
  };

socket.onmessage = async (event) => {
  try {
    const mensagem = JSON.parse(event.data);

    console.log("Evento recebido pelo WebSocket:", mensagem);

    switch (mensagem.tipo) {
      case "prazo_expirado":
        console.log(
          "Cliente não compareceu:",
          mensagem.agendamento_id
        );

        await carregarDashboard();
        break;

      case "cliente_chamado":
      case "presenca_confirmada":
        await carregarDashboard();
        break;

      case "atendimento_finalizado":
        await carregarDashboard();
        await buscarRelatorio();
        break;

      case "teste":
        console.log("Teste WebSocket:", mensagem.mensagem);
        break;

      default:
        console.log(
          "Evento WebSocket não tratado:",
          mensagem.tipo
        );
    }
  } catch (error) {
    console.error(
      "Erro ao processar mensagem WebSocket:",
      error
    );
  }
};

  socket.onerror = (error) => {
    console.error(" Erro no WebSocket ADMIN:", error);
  };

  socket.onclose = (event) => {
    console.log(
      "WebSocket ADMIN fechado:",
      event.code,
      event.reason
    );
  };

  return () => {
    socket.close();
  };
}, [autorizado]);

  // 📊 Carregar dados atualizados do dashboard
  const carregarDashboard = async () => {
    try {
      const response = await fetch(
        `${API_URL}/agendamentos/admin/dashboard`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const erro = await response.text();
        console.error("Erro ao carregar dashboard:", erro);
        return;
      }

      const data = await response.json();

      console.log("Dados do dashboard carregados:", data);

      console.log(
        "Agendamentos recebidos:",
        data.agendamentos?.map((ag) => ({
          id: ag._id,
          nome: ag.nome,
          status: ag.status,
        }))
      );

      setDashboard(data);

      console.log("Dashboard atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    }
  };

  // Carregamento inicial
  useEffect(() => {
    if (!autorizado) return;

    carregarDashboard();  
  }, [autorizado]);


  const buscarRelatorio = async () => {
  try {
    const response = await fetch(
      `${API_URL}/agendamentos/admin/dashboard/relatorio-atendimentos`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar relatório");
    }

    const dados = await response.json(); 

    setDadosFaturamento(dados);

  } catch (error) {
    console.error("Erro ao buscar faturamento:", error);
  }
};
  
useEffect(() => {
  if (!autorizado) return;
  
  buscarRelatorio();
}, [autorizado]);

  if (!autorizado) return null;
  if (!dashboard) return <p className="text-center">Carregando...</p>;

  // ⏳ Loading
  if (!autorizado) return null;
  if (!dashboard) return <p className="text-center">Carregando...</p>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>

        <div className="grid md:grid-cols-3 gap-5">
          <StatCard title="Clientes na fila" value={dashboard.fila} />
          <StatCard
            title="Atendimentos hoje"
            value={dashboard.atendimentosHoje}
          />

          <StatCard 
            title="Desistiram"
            value={dashboard.desistenciasHoje}
          />

          {/* 
          <CalendarFilter 
            datasDisponiveis={datasDisponiveis}
            mostrarCalendario={mostrarCalendario}
            setMostrarCalendario={setMostrarCalendario}
            diaSelecionado={diaSelecionado}
            setDiaSelecionado={setDiaSelecionado}
          />
          */}

          {/*<StatCard
            title="Barbeiros ativos"
            value={dashboard.barbeirosAtivos}
          />*/}

          
          
        </div>
        
          <BarberTable
            data={dadosFiltrados} 
            diaSelecionado={diaSelecionado}
            setDiaSelecionado={setDiaSelecionado}
            servicos={servicos}
            mostrarCalendario={mostrarCalendario}
            setMostrarCalendario={setMostrarCalendario}
            datasDisponiveis={datasDisponiveis}
            faturamentoHoje={dadosFaturamento?.faturamentoHoje || 0}
          />
      </div>
    </AdminLayout>
  );
} 
