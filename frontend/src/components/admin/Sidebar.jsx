"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 

export default function Sidebar() {
  // O pathname identifica em qual URL o usuário está no momento
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 bg-slate-900 border-r border-slate-200 flex flex-col p-4 space-y-2">
      
      {/* Logo ou Título do seu App */}
      <div className="px-4 py-6 font-black text-xl text-blue-600 tracking-wider">
        BARBER FLOW
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        
        {/* Link para a Fila de Atendimento (Página Principal) */}
        <Link
          href="/admin"
          className={`
            flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition text-sm
            ${
              pathname === "/admin"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
            }
          `}
        >
          <span>💈</span> Fila de Atendimento
        </Link>

        {/* Link para a sua Nova Página de Relatório */}
        <Link
          href="/admin/relatorio"
          className={`
            flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition text-sm
            ${
              pathname === "/admin/relatorio"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
            }
          `}
        >
          <span>📋</span> Relatório Histórico
        </Link>

      </nav> 

      {/* Rodapé do menu ou botão de Sair se tiver */}
      <div className="border-t border-slate-100 pt-4 px-4 text-xs text-gray-400 font-medium text-center">
        v1.0.0
      </div>

    </aside>
  );
} 