"use client";

import React, { createContext, useContext, useState } from "react";
import { LogOut } from "lucide-react";
import AgendaSidbar from "./Sidbar";
import { useAgenda } from "./AgendaLayout";

export default function AgendaTopbar({nomeUser, onExit}) {

  

  const { exit } = useAgenda();

  const sair = async () => {
    console.log("Usuário deslogado");

    if (exit) {
        exit();
    }
  };
  return (
       <header className="fixed top-2 left-2 right-2 z-50 flex items-center gap-4">
      {/* 
        O contêiner agora é 'relative'. O flex layout, padding e rounded continuam aqui,
        mas o fundo e o desfoque foram movidos para a div absoluta abaixo.
      */}
      <div className="relative flex items-center justify-between py-4 px-6 rounded-3xl w-full">
        
        {/* 
          CAMADA DE FUNDO ISOLADA: 
          O efeito de opacidade e desfoque fica preso apenas aqui. 
          O '-z-10' joga essa película para trás do texto e dos botões.
        */}
        <div className="absolute inset-0 bg-gray-200/30 backdrop-blur-sm shadow-md rounded-3xl -z-10 pointer-events-none" />

        {/* Logo */}
        <div className="font-bold text-black z-10">💈 BarberFlow</div>

        {/* Lado Direito: Sair + Sidebar (Ficam acima do fundo, sem sofrer blur) */}
        <div className="flex items-center gap-4 z-10">
          {/* Botão de Sair */}
          <button
            onClick={sair}
            className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors" />
            <span className="hidden sm:inline text-black">Sair</span>
          </button>

          {/* O botão options e o menu da Sidebar agora estão 100% livres do desfoque */}
          <AgendaSidbar nomeUser={nomeUser} />
        </div>

      </div>
    </header>
  );
}