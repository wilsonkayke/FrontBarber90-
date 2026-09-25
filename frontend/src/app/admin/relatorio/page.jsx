"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Relatorio from "../../../components/admin/Relatorio";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const servicos = [
  { id: 1, nome: "Corte de cabelo" },
  { id: 2, nome: "Barba" },
  { id: 3, nome: "Corte e barba" },
  { id: 4, nome: "Corte infantil" },
  { id: 5, nome: "Sobrancelha" },
];

export default function RelatorioPage() {
  const [dadosRelatorio, setDadosRelatorio] = useState(null);

  const [filtroStatus, setFiltroStatus] = useState("todos");

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [erroPeriodo, setErroPeriodo] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;

    const token = localStorage.getItem("token");

    async function carregarRelatorio() {
      try {
        setLoading(true);
        setErroPeriodo("");

        const params = new URLSearchParams();

        if (dataInicio) {
          params.append("data_inicio", dataInicio); 
        }
        
        if (dataFim) {
          params.append("data_fim", dataFim);
        }

        const url = `${API_URL}/agendamentos/admin/dashboard/relatorio-atendimentos${
          params.toString() ? `?${params.toString()}` : ""
        }`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar relatório");
        }
        
        const data = await response.json();

        if (ativo) {
          setDadosRelatorio(data);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    if (dataInicio && dataFim && dataInicio > dataFim) {
      setErroPeriodo(
        "A data inicial não pode ser posterior à data final."
      );
      
      setDadosRelatorio(null);
      setLoading(false);

      return () => {
        ativo = false;
      };
    }

    carregarRelatorio();  

    return () => {
      ativo = false;
    };  
  }, [dataInicio, dataFim]);

  const dadosRelatorioFiltrados = (
  dadosRelatorio?.relatorio || []
).filter((item) => {
  if (filtroStatus === "finalizados") {
    return item.total_finalizados > 0;
  }

  if (filtroStatus === "cancelados") {
    return item.total_cancelados > 0;
  }

  return true;
});

const dadosGraficosServicos = [];

dadosRelatorio?.relatorio?.forEach((dia) => {
  dia.servicos.forEach((servico) => {
    const existente = dadosGraficosServicos.find(
      (item) => item.servico_id === servico.servico_id
    );

    if (existente) {
      existente.quantidade += servico.total;
    } else {
      dadosGraficosServicos.push({
        servico_id: servico.servico_id,
        quantidade: servico.total,
      });
    }
  });
});

const dadosGrafico = dadosGraficosServicos.map((item) => {
  const servicoEncontrado = servicos.find(
    (servico) => servico.id === item.servico_id
  );

  return {
    servico: servicoEncontrado?.nome || "Serviço desconhecido",
    quantidade: item.quantidade,
  };
});

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          Históricos de Atendimentos
        </h2>

        {erroPeriodo && (
        <div className="bg-red-500 border-red-200 text-red-700  rounded-xl p-4">
        <span>
          {erroPeriodo}
        </span>
      </div>
      )}

        {loading ? (
          <p className="text-center py-6">
            Carregando dados do histórico...
          </p>
        ) : (
          <Relatorio

            

            dadosGrafico={dadosGrafico}

            dadosRelatorio={dadosRelatorioFiltrados}
            filtroStatus={filtroStatus}
            servicos={servicos}
            setFiltroStatus={setFiltroStatus}

            faturamentoHoje={
              dadosRelatorio?.faturamentoHoje || 0
            }

            faturamentoSemana={
              dadosRelatorio?.faturamentoSemana || 0
            }

            faturamentoMes={
              dadosRelatorio?.faturamentoMes || 0
            }

            faturamentoTotal={
              dadosRelatorio?.faturamentoTotal || 0
            }

            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
          />
        )}
      </div>
    </AdminLayout>
  );
}