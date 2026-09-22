"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [montado, setMontado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    setMontado(true);

    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          setUsuario(JSON.parse(userString));
        } catch (e) {
          console.error("Erro ao converter dados do usuário:", e);
        }
      }
    }
  }, []);

  const sair = () => {
    // Desabilitar a seleção automática do Google Sign-In
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }

    localStorage.clear();
    sessionStorage.clear();
    // Limpar o cookie "g_state"
    document.cookie =
      "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirecionamento ou lógica de logout que você já usa aqui...
    window.location.href = "/login";
  };

  return (
    <>
      <header className="sticky top-0 z-50 mt-3 flex items-center justify-between p-4 bg-gray-200/50 backdrop-blur-sm shadow-sm rounded-3xl mx-4 ">
        {/* Esquerda */}
        <div className="flex items-center space-x-4 ">
          {/* Menu Mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            ☰
          </button>

          {/* Se 'open' for true, o Sidebar é renderizado */}
          {open && (
            <div className="absolute z-50">
              <Sidebar />
            </div>
          )}

          <div className="flex items-center">
            <img
              src="/imagens/BarberFlowRedondo.png"
              alt="Logo BarberFlow"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Direita */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-sm text-black font-medium">
            Olá, {montado && usuario?.usuario ? usuario.usuario : "Ramon"}
          </div>

          <button
            onClick={sair}
            className="group flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-600 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* AQUI ↓↓↓ */}
      {open && (
        <div
          className="
      fixed
      inset-0
      bg-black/40
      z-50
      md:hidden
    "
          onClick={() => setOpen(false)}
        >
          <div
            className="w-64 h-full bg-gray-200/50 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
