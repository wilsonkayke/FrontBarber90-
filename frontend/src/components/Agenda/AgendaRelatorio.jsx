"use client";

import React, { useEffect } from "react";
import AgendaTopbar from "../Agenda/AgendaTopbar";
import Footer from "./Footer";
import { useAuth } from "../AuthContext/AuthContext";

export default function AgendaRelatorio({ dados, nomeUsuario }) {
  const { usuario } = useAuth();

  console.log("USUÁRIO DO AUTH CONTEXT:", usuario);

  useEffect(() => {
    console.log("LOCALSTORAGE USER:", localStorage.getItem("user"));
  }, []);

  if (!dados) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-gray-400">
          Carregando dados do relatório...
        </p>
      </div>
    );
  }

  const servicoMaisUsado = dados?.servicos?.reduce(
    (maior, servico) =>
      servico.quantidade > maior.quantidade ? servico : maior,
    dados?.servicos?.[0]
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900">

      {/* =====================================================
          IMAGEM DE FUNDO
      ====================================================== */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/imagens/principal.jpg')",
        }}
      />

      {/* =====================================================
          SOBREPOSIÇÃO
      ====================================================== */}
      <div className="fixed inset-0 z-0 bg-slate-950/55" />

      {/* =====================================================
          TOPBAR
      ====================================================== */}
      <AgendaTopbar />

      {/* =====================================================
          CONTEÚDO PRINCIPAL
      ====================================================== */}
      <main className="relative z-10 px-4 pt-24 pb-10">

        <div className="max-w-4xl mx-auto">

          {/* =================================================
              CABEÇALHO
          ================================================== */}
          <div
            className="
              bg-slate-900/90
              backdrop-blur-md
              rounded-3xl
              p-6
              mb-5
              shadow-2xl
              border border-white/10
            "
          >
            <div className="flex items-center gap-4">

              {/* ÍCONE */}
              <div
                className="
                  w-14
                  h-14
                  shrink-0
                  rounded-2xl
                  bg-white/10
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-2xl
                "
              >
                💈
              </div>

              {/* TÍTULO */}
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-gray-400">
                  BARBERFLOW9
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Seu relatório
                </h1>

                <p className="text-sm text-gray-400 mt-1">
                  Olá{" "}
                  <span className="font-semibold text-amber-400">
                    {nomeUsuario}
                  </span>
                  ! Aqui está o resumo dos seus atendimentos.
                </p>
              </div>

            </div>
          </div>

          {/* =================================================
              CARDS DE MÉTRICAS
          ================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* =================================================
                ATENDIMENTOS
            ================================================== */}
            <div
              className="
                bg-slate-900/90
                backdrop-blur-md
                rounded-3xl
                p-5
                shadow-2xl
                border border-white/10
              "
            >
              <div className="flex items-center justify-between mb-4">

                <p className="text-xs font-bold tracking-widest text-gray-400">
                  ATENDIMENTOS
                </p>

                <div className="w-9 h-9 rounded-xl bg-sky-400/10 flex items-center justify-center">
                  ✂️
                </div>

              </div>

              <p className="text-4xl font-black text-sky-400">
                {dados.quantidade_atendimentos}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Serviços finalizados
              </p>
            </div>

            {/* =================================================
                CANCELAMENTOS
            ================================================== */}
            <div
              className="
                bg-slate-900/90
                backdrop-blur-md
                rounded-3xl
                p-5
                shadow-2xl
                border border-white/10
              "
            >
              <div className="flex items-center justify-between mb-4">

                <p className="text-xs font-bold tracking-widest text-gray-400">
                  CANCELAMENTOS
                </p>

                <div className="w-9 h-9 rounded-xl bg-red-400/10 flex items-center justify-center">
                  ✕
                </div>

              </div>

              <p className="text-4xl font-black text-red-400">
                {dados.quantidade_cancelamentos}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Agendamentos cancelados
              </p>
            </div>

            {/* =================================================
                TOTAL GASTO
            ================================================== */}
            <div
              className="
                bg-slate-900/90
                backdrop-blur-md
                rounded-3xl
                p-6
                shadow-2xl
                border border-emerald-400/20
                sm:col-span-2
              "
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-gray-400">
                    SEU INVESTIMENTO
                  </p>

                  <p className="text-4xl sm:text-5xl font-black text-emerald-400 mt-2">
                    R${" "}
                    {Number(dados.total_gasto || 0).toFixed(2).replace(".", ",")}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Total investido em seu visual
                  </p>

                </div>

                <div
                  className="
                    hidden sm:flex
                    w-14
                    h-14
                    rounded-2xl
                    bg-emerald-400/10
                    items-center
                    justify-center
                    text-2xl
                  "
                >
                  💰
                </div>

              </div>
            </div>

            {/* =================================================
                SERVIÇO MAIS UTILIZADO
            ================================================== */}
            <div
              className="
                bg-slate-900/90
                backdrop-blur-md
                rounded-3xl
                p-6
                shadow-2xl
                border border-blue-400/20
                sm:col-span-2
              "
            >
              <div className="flex items-center gap-4">

                {/* ÍCONE */}
                <div
                  className="
                    w-14
                    h-14
                    shrink-0
                    rounded-2xl
                    bg-blue-400/10
                    border border-blue-400/10
                    flex
                    items-center
                    justify-center
                    text-2xl
                  "
                >
                  ✂️
                </div>

                {/* INFORMAÇÕES */}
                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-gray-400">
                    SERVIÇO MAIS UTILIZADO
                  </p>

                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {servicoMaisUsado?.nome || "Nenhum serviço"}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    {servicoMaisUsado
                      ? `${servicoMaisUsado.quantidade} ${
                          servicoMaisUsado.quantidade === 1
                            ? "vez realizada"
                            : "vezes realizadas"
                        }`
                      : "Nenhum serviço realizado"}
                  </p>

                </div>

              </div>
            </div>

            {/* =================================================
                SERVIÇOS UTILIZADOS
            ================================================== */}
            <div
              className="
                bg-slate-900/90
                backdrop-blur-md
                rounded-3xl
                p-6
                shadow-2xl
                border border-white/10
                sm:col-span-2
              "
            >

              {/* CABEÇALHO */}
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-gray-400">
                    HISTÓRICO DE SERVIÇOS
                  </p>

                  <h2 className="text-xl font-bold text-white mt-1">
                    Serviços utilizados
                  </h2>

                </div>

                <div
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                    text-xl
                  "
                >
                  💈
                </div>

              </div>

              {/* LISTA */}
              <ul className="space-y-2 mt-5">

                {dados.servicos?.length > 0 ? (

                  dados.servicos.map((servico) => (

                    <li
                      key={servico.nome}
                      className="
                        flex
                        items-center
                        justify-between
                        bg-white/5
                        border
                        border-white/10
                        rounded-2xl
                        px-4
                        py-3
                        transition
                        duration-200
                        hover:bg-white/10
                      "
                    >

                      {/* NOME DO SERVIÇO */}
                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-9
                            h-9
                            shrink-0
                            rounded-xl
                            bg-white/10
                            flex
                            items-center
                            justify-center
                          "
                        >
                          ✂️
                        </div>

                        <div>

                          <h3 className="text-sm font-semibold text-white">
                            {servico.nome}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            Serviço utilizado
                          </p>

                        </div>

                      </div>

                      {/* QUANTIDADE */}
                      <div className="text-right">

                        <p className="text-lg font-bold text-amber-400">
                          {servico.quantidade}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {servico.quantidade === 1
                            ? "vez"
                            : "vezes"}
                        </p>

                      </div>

                    </li>

                  ))

                ) : (

                  <li
                    className="
                      text-center
                      text-sm
                      text-gray-400
                      py-6
                      border
                      border-dashed
                      border-white/10
                      rounded-2xl
                    "
                  >
                    Nenhum serviço realizado ainda.
                  </li>

                )}

              </ul>

            </div>

          </div>

        </div>

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <Footer />

    </div>
  );
} 