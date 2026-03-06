"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import BarberTable from "../../components/admin/barberTable";

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [autorizado, setAutorizado] = useState(false);

  async function chamarProximo() {
  try {
    const response = await fetch(
      "http://localhost:8000/agendamentos/admin/chamar",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const erro = await response.json();
      console.log("Erro:", erro.detail);
      return;
    }

    const data = await response.json();
    console.log("Cliente chamado:", data);

    // 🔥 Atualiza o dashboard imediatamente
    setDashboard((prev) => ({
      ...prev,
      fila: prev.fila - 1,
      agendamentos: prev.agendamentos.slice(1), // remove o primeiro
    }));

  } catch (error) {
    console.error("Erro ao chamar cliente:", error);
  }
}

async function finalizarAtendimento() {
  try {
    const response = await fetch(
      "http://localhost:8000/agendamentos/admin/finalizar",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const erro = await response.json();
      console.log(erro.detail);
      return;
    }

    const data = await response.json();
    console.log("Atendimento finalizado:", data);

    // 🔥 Remove da tabela
    setDashboard((prev) => ({
      ...prev,
      agendamentos: prev.agendamentos.filter(
        (ag) => ag._id !== data.agendamento_id
      ),
      atendimentosHoje: prev.atendimentosHoje + 1,
    }));

  } catch (error) {
    console.error(error);
  }
}
  
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.replace("/agenda");
      return;
    }

    setAutorizado(true);
  }, []);

  useEffect(() => {
  if (!autorizado) return;

  let ativo = true;

  async function carregarDashboard() {
    try {
      const response = await fetch(
        "http://localhost:8000/agendamentos/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        console.log("Erro:", response.status);
        return;
      }

      const data = await response.json();

      if (ativo) {
        setDashboard(data);
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
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
  if (!dashboard) return <p>Carregando...</p>;


  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          Dashboard Administrativo
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          <StatCard title="Clientes na fila" value={dashboard.fila} />
          <StatCard title="Atendimentos hoje" value={dashboard.atendimentosHoje} />
          <StatCard title="Barbeiros ativos" value={dashboard.barbeirosAtivos} />
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
