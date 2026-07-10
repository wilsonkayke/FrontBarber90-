"use client";


import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

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
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirecionamento ou lógica de logout que você já usa aqui...
    window.location.href = "/login"; 
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white border-b shadow-sm">
        {/* Esquerda */}
        <div className="flex items-center space-x-4">
          {/* Menu Mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            ☰
          </button>

          {/* Se 'open' for true, o Sidebar é renderizado */}
          {open && (
            <div className="absolute z-50">
              <Sidebar />
            </div>
          )}

          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
            Painel Administrativo
          </h2>
        </div>

        {/* Direita */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-sm text-gray-600">
            Olá, {montado && usuario?.usuario ? usuario.usuario : "Ramon"}
          </div>

          <button
            onClick={sair}
            className="
            px-4
            py-2
            border
            rounded-lg
            hover:bg-red-500
            hover:text-white
            transition
          "
          >
            Sair
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
            className="w-64 h-full bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
