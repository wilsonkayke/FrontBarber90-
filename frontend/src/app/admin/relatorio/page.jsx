"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Relatorio from "../../../components/admin/Relatorio"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const servicos = [
  { id: 1, nome: "Corte de cabelo" },
  { id: 2, nome: "Barba" },
  { id: 3, nome: "Corte e barba" },
  { id: 4, nome: "Corte infantil" },
  { id: 5, nome: "Sobrancelha" },
];

export default function RelatorioPage() {
  const [dadosRelatorioBrutos, setDadosRelatorioBrutos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;
    const token = localStorage.getItem("token");

    async function carregarRelatorio() {
      try {
        const response = await fetch(
          `${API_URL}/agendamentos/admin/dashboard/relatorio-atendimentos`, 
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // Estamos forçando o Next.js a buscar dados novos do banco SEMPRE, ignorando o cache
            cache: "no-store", 
          }
        );

        if (!response.ok) return;
        const data = await response.json();
        
        if (ativo) {
          setDadosRelatorioBrutos(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        if (ativo) setLoading(false);
      }
    }

    // Carrega imediatamente ao abrir a tela
    carregarRelatorio();
    // Aqui estamos carregando/atualizando os dados do relatório a cada 5 segundos
    const interval = setInterval(carregarRelatorio, 5000);

    return () => {
      ativo = false;
      clearInterval(interval);
    };
  }, []);

  const dadosRelatorioFiltrados = dadosRelatorioBrutos.filter((item) => {
    if (filtroStatus === "finalizados") return item.total_finalizados > 0;
    if (filtroStatus === "cancelados") return item.total_cancelados > 0;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Históricos de Atendimentos</h2>
        
        {loading ? (
          <p className="text-center py-6">Carregando dados do histórico...</p>
        ) : (
          <Relatorio
            dadosRelatorio={dadosRelatorioFiltrados}
            filtroStatus={filtroStatus}
            servicos={servicos}
            setFiltroStatus={setFiltroStatus}
          />
        )}
      </div>
    </AdminLayout>
  );
}