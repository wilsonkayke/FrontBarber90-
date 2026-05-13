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
            title="Barbeiros ativos"
            value={dashboard.barbeirosAtivos}
          />
        </div>

        <BarberTable
          data={dashboard.agendamentos}
          onChamar={chamarProximo}
          onFinalizar={finalizarAtendimento}
        />
      </div>
    </AdminLayout>
  );
}
