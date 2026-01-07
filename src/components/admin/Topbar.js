"use client";
import React from "react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2 rounded bg-gray-100">☰</button>
        <h2 className="text-lg font-semibold">Painel Administrativo</h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">Olá, Ramon</div>
        <button className="px-3 py-1 border rounded">Sair</button>
      </div>
    </header>
  );
}
