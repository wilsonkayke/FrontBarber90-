"use client";

import React from "react";
import AgendaTopbar from "../Agenda/AgendaTopbar";
import Footer from "./Footer";
import { useAuth } from "../AuthContext/AuthContext";
import { useEffect } from "react";

export default function AgendaRelatorio({ dados, nomeUsuario }) {

   if (!dados) {
    return (
      <div className="p-4 text-center text-gray-500">
        Carregando dados do relatório...
      </div>
    );
  }


  const servicoMaisUsado = dados?.servicos.reduce(
    (maior, servico) =>
      servico.quantidade > maior.quantidade ? servico : maior,
    dados.servicos[0],
  );

  const { usuario } = useAuth();

  console.log("USUÁRIO DO AUTH CONTEXT:", usuario);

  useEffect(() => {
    console.log(
      "LOCALSTORAGE USER:",
      localStorage.getItem("user")
    );
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#A8B8CC]">
      {/* IMAGEM DE FUNDO */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/imagens/principal.jpg')",
        }}
      />

      {/* CAMADA DE SOBREPOSIÇÃO */}
      <div className="fixed inset-0 z-0 bg-slate-900/30" />

      {/* TOPBAR */}
      <AgendaTopbar  />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative z-10 px-4 pt-22 pb-10">
        <div className="max-w-4xl mx-auto">
          {/* TÍTULO */}
          <div className="bg-slate-500/90 backdrop-blur-sm py-3 px-3 rounded-2xl mb-4 text-black">
            <h1 className="text-3xl sm:text-4xl font-bold">Relatório</h1>
            <div className="border space-y-4"></div>

            <p className="mt-2 text-white/80">
              Olá <span className="font-semibold text-orange-500">
                {nomeUsuario}
              </span>! Aqui
              está o resumo dos seus atendimentos.
            </p>
          </div>

          {/* CARDS DE MÉTRICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ATENDIMENTOS */}
            <div className="bg-slate-500/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/20">
              <p className="text-sm font-bold text-white mb-2">
                ATENDIMENTOS REALIZADOS
              </p>

              <div className="border space-y-4"></div>

              <p className="text-3xl font-bold text-sky-900">
                {dados.quantidade_atendimentos}
              </p>

              <p className="text-sm text-black mt-1">Serviços finalizados</p>
            </div>

            {/* CANCELAMENTOS */}
            <div className="bg-slate-500/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/20">
              <p className="text-sm font-bold text-white mb-2">CANCELAMENTOS</p>

              <div className="border space-y-4"></div>

              <p className="text-3xl font-bold text-red-500">
                {dados.quantidade_cancelamentos}
              </p>

              <p className="text-sm text-black mt-1">Agendamentos cancelados</p>
            </div>

            {/* TOTAL GASTO */}
            <div className="bg-slate-500/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/20">
              <p className="text-sm font-bold text-gray-200 mb-2">
                TOTAL GASTO
              </p>

              <div className="border space-y-4"></div>

              <p className="text-3xl font-bold text-emerald-600">
                R$ {dados.total_gasto}
              </p>

              <p className="text-sm text-black mt-1">Em serviços realizados</p>
            </div>

            {/* SERVIÇO FAVORITO */}
            <div className="bg-slate-500/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/20">
              <p className="text-sm font-bold text-gray-200 mb-2">
                SERVIÇO MAIS UTILIZADO
              </p>

              <div className="border space-y-4"></div>

              <p className="text-2xl font-bold text-slate-800">
                {servicoMaisUsado?.nome || "Nenhum serviço"}
              </p>

              <p className="text-sm text-black mt-1">
                {servicoMaisUsado
                  ? `${servicoMaisUsado.quantidade} vezes realizado`
                  : "Nenhum serviço realizado"}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <div>
        
      </div>
    </div>
  );
}
