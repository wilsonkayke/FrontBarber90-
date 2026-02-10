"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  const usuario = JSON.parse(localStorage.getItem("cliente") || "{}");

  const sair = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2 rounded bg-gray-100">☰</button>
        <h2 className="text-lg font-semibold">Painel Administrativo</h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Olá, {usuario.usuario || "Administrador"}
        </div>

        <button
          onClick={sair}
          className="px-3 py-1 border rounded hover:bg-red-500 hover:text-white transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
