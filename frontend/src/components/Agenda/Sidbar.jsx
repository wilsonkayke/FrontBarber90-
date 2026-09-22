"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAgenda } from "./AgendaLayout";

export default function AgendaSidbar({ onOptionsClick, nomeUser }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex">
      {/* Botão de Opções original (3 pontinhos) */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center p-2 text-black transition-colors rounded-full hover:text-gray-600 hover:bg-gray-800 focus:outline-none"
      >
        ☰
      </button>

      {/* 1. Fundo Escuro com desfoque (Backdrop) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* 2. Menu Lateral Esquerda/Direita (Ocupa 50% da tela no desktop ou w-full no mobile) */}
      <div
        className={`
  fixed top-0 right-0
  h-full sm:w-[50vw]

  bg-gray-600/60
  backdrop-blur-sm
  border-l border-white/20

  text-white
  z-50
  p-6
  shadow-2xl

  transform
  transition-transform
  duration-500
  ease-in-out

  flex flex-col justify-between

  ${isOpen ? "translate-x-0" : "translate-x-full"}
`}
      >
        {/* Topo do Menu Lateral */}
        <div>
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h2 className="text-xl font-black tracking-wider text-orange-400">
              BARBER FLOW
            </h2>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-sm  px-3 py-1.5 font-bold "
            >
              X
            </button>
          </div>

          {/* Links e Informações (Igual à imagem que você mandou) */}
          <div className="space-y-4">
            {/*
            <div className="mb-6 b-4">
              <h2 className="text-xl font-bold text-white">
                Olá,  4. EXIBE O NOME DO CONTEXTO 
                <span className="text-orange-400">{nomeUser || "Cliente"}</span>
                !
              </h2>
            </div>
              */}
            <Link
              href="/agenda"
              onClick={() => setIsOpen(true)}
              className="w-full flex items-center gap-3 text-slate-400 p-4 rounded-xl font-semibold hover:bg-slate-900 text-left transition-colors"
            >
              👤 <span>Agenda</span>
            </Link>

            <Link
              href="/agenda/relatorio"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 text-slate-400 p-4 rounded-xl font-semibold hover:bg-slate-900 text-left transition-colors"
            >
              📋 <span>Relatório dos serviços</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center mt-auto space-x-4 px-4 py-4 rounded-xl bg-gray-800/50 backdrop-blur-sm shadow-sm">
          <p className="text-sm font-semibold text-gray-200">Redes Sociais:</p>
          <span>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="imagens/whatsapp1.png"
                alt="WhatsApp"
                className="inline-block w-6 h-6"
              />
            </a>
          </span>

          <span>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="imagens/instagram1.png"
                alt="Instagram"
                className="inline-block w-6 h-6"
              />
            </a>
          </span>
        </div>

        {/* Rodapé do Menu Lateral */}
        <div className="border-t border-slate-900 pt-4 flex justify-between items-center text-xs text-slate-950 mt-3">
          <span>v1.0.0</span>
        </div>  
      </div>
    </div>
  );
}
