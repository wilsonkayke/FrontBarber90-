'use client';

import React, { useState } from "react";

export default function AgendaSidbar({ onOptionsClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Botão de Opções original (3 pontinhos) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
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
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-[50vw] bg-slate-950 text-white z-50 p-6 shadow-2xl
        transform transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        
        {/* Topo do Menu Lateral */}
        <div>
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h2 className="text-xl font-black tracking-wider text-blue-500">BARBER FLOW</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-sm bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              Fechar
            </button>
          </div>

          {/* Links e Informações (Igual à imagem que você mandou) */}
          <div className="space-y-4">
            <button 
              onClick={() => { onOptionsClick?.('FILA_ATENDIMENTO'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 bg-blue-600 p-4 rounded-xl font-bold shadow-lg shadow-blue-600/30 text-left transition-transform active:scale-95"
            >
              💈 <span>Perfil</span>
            </button>

            <button 
              onClick={() => { onOptionsClick?.('HISTORICO'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 text-slate-400 p-4 rounded-xl font-semibold hover:bg-slate-900 text-left transition-colors"
            >
              📋 <span>Relatório dos serviços</span>
            </button>
          </div>
        </div>

        {/* Rodapé do Menu Lateral */}
        <div className="border-t border-slate-900 pt-4 flex justify-between items-center text-xs text-slate-500">
          <div className="bg-black p-2 rounded-full font-bold">N</div>
          <span>v1.0.0</span>
        </div>

      </div>
    </div>
  );
}