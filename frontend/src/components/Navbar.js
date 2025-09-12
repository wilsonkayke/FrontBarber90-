"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo ou título */}
        <h1 className="text-lg font-bold">💈 BarberQueue</h1>

        {/* Botão hambúrguer (visível apenas em telas pequenas) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Menu normal (desktop) */}
        <ul className="hidden md:flex gap-6">
          <li><Link href="/">🏠 Início</Link></li>
          <li><Link href="/fila">📋 Fila</Link></li>
          <li><Link href="/novo-cliente">➕ Novo Cliente</Link></li>
          <li><Link href="/admin">⚙️ Admin</Link></li>
        </ul>
      </div>

      {/* Menu mobile (aparece quando clicar no hambúrguer) */}
      {isOpen && (
        <ul className="flex flex-col gap-4 mt-4 md:hidden">
          <li><Link href="/" onClick={() => setIsOpen(false)}>🏠 Início</Link></li>
          <li><Link href="/fila" onClick={() => setIsOpen(false)}>📋 Fila</Link></li>
          <li><Link href="/novo-cliente" onClick={() => setIsOpen(false)}>➕ Novo Cliente</Link></li>
          <li><Link href="/admin" onClick={() => setIsOpen(false)}>⚙️ Admin</Link></li>
        </ul>
      )}
    </nav>
  );
}
