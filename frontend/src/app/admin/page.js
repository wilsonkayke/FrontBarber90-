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

        <BarberTable data={dashboard.agendamentos} />
      </div>
    </AdminLayout>
  );
} 
