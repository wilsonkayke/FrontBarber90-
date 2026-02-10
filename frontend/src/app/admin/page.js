"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todaysAppointments: 0,
    clientsInQueue: 0,
    weeklyRevenue: 0,
    avgWaitTime: "0m",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Exemplo: buscar em /api/admin/stats
    // Por enquanto usamos dados mock — substitua por fetch real depois
    const fetchStats = async () => {
      setLoading(true);
      try {
        // const res = await fetch('/api/admin/stats');
        // const data = await res.json();
        const data = {
          todaysAppointments: 12,
          clientsInQueue: 3,
          weeklyRevenue: 845.5,
          avgWaitTime: 14, // minutos
        };
        setStats({
          todaysAppointments: data.todaysAppointments,
          clientsInQueue: data.clientsInQueue,
          weeklyRevenue: data.weeklyRevenue,
          avgWaitTime: `${data.avgWaitTime} min`,
        });
      } catch (err) {
        console.error("Erro ao buscar stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Dashboard</h3>
          <div className="text-sm text-gray-500">
            {loading ? "Carregando..." : "Dados atualizados"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Agendamentos hoje"
            value={loading ? "—" : stats.todaysAppointments}
            subtitle="Total para o dia"
            icon="📅"
          />
          <StatCard
            title="Clientes na fila"
            value={loading ? "—" : stats.clientsInQueue}
            subtitle="Em espera agora"
            icon="👥"
          />
          <StatCard
            title="Faturamento (semana)"
            value={loading ? "—" : `R$ ${stats.weeklyRevenue}`}
            subtitle="Estimado"
            icon="💰"
          />
          <StatCard
            title="Tempo Médio de espera"
            value={loading ? "—" : stats.avgWaitTime}
            subtitle="Média dos atendimentos"
            icon="⏱️"
          />
        </div>

        {/* Espaço para gráficos ou tabelas futuros */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h4 className="font-semibold mb-2">Atividades recentes</h4>
          <p className="text-sm text-gray-500">Aqui vão logs / últimas ações do dia.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

