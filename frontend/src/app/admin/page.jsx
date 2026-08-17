"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import BarberTable from "../../components/admin/barberTable";
import Ralatorio from "../../components/admin/Relatorio";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState(null);
  const [autorizado, setAutorizado] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState("hoje");
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

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

  // 🚀 Chamar próximo cliente
  async function chamarProximo() {
    try {
      const response = await fetch(`${API_URL}/agendamentos/admin/chamar`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const erro = await response.json();
        console.log("Erro:", erro.detail);
        return;
      }

      const data = await response.json();
      console.log("Cliente chamado:", data);

      setDashboard((prev) => ({
        ...prev,
        fila: prev.fila - 1,
        agendamentos: prev.agendamentos.slice(1),
      }));
    } catch (error) {
      console.error("Erro ao chamar cliente:", error);
    }
  }

  // ✅ Finalizar atendimento
  async function finalizarAtendimento() {
    try {
      const response = await fetch(`${API_URL}/agendamentos/admin/finalizar`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const erro = await response.json();
        console.log("Erro:", erro.detail);
        return;
      }

      const data = await response.json();
      console.log("Atendimento finalizado:", data);

      setDashboard((prev) => ({
        ...prev,
        agendamentos: prev.agendamentos.filter(
          (ag) => ag._id !== data.agendamento_id,
        ),
        atendimentosHoje: prev.atendimentosHoje + 1,
      }));
    } catch (error) {
      console.error("Erro ao finalizar atendimento:", error);
    }
  }

  // 🔐 Verifica se é admin
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.replace("/agenda");
      return;
    }

    setAutorizado(true);
  }, []);

  // 📊 Carregar dashboard (auto refresh)
  useEffect(() => {
    if (!autorizado) return;

    let ativo = true;

    async function carregarDashboard() {
      try {
        const token = localStorage.getItem("token");
        console.log("TOKEN:", token);
        console.log("API_URL:", API_URL);

        const response = await fetch(
          `${API_URL}/agendamentos/admin/dashboard`,
          {
            headers: getAuthHeaders(),
          },
        );

        console.log("STATUS:", response.status);

        if (!response.ok) {
          const erro = await response.text();
          console.log("ERRO BACKEND:", erro);
          setDashboard({ erro: true });
          return;
        }

        const data = await response.json();
        console.log("DADOS:", data);

        if (ativo) {
          setDashboard(data);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        setDashboard({ erro: true });
      }
    }

    carregarDashboard();

    const interval = setInterval(carregarDashboard, 3000);

    return () => {
      ativo = false;
      clearInterval(interval);
    };
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
            onChamar={chamarProximo}
            onFinalizar={finalizarAtendimento}
            diaSelecionado={diaSelecionado}
            setDiaSelecionado={setDiaSelecionado}
//            servicos={servicos}
            mostrarCalendario={mostrarCalendario}
            setMostrarCalendario={setMostrarCalendario}
            datasDisponiveis={datasDisponiveis}
          />
      </div>
    </AdminLayout>
  );
} 
