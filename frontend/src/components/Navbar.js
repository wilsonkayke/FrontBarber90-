"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <ul className="flex gap-4">
        <li><Link href="/">🏠 Início</Link></li>
        <li><Link href="/fila">📋 Fila</Link></li>
        <li><Link href="/novo-cliente">➕ Novo Cliente</Link></li>
        <li><Link href="/admin">⚙️ Admin</Link></li>
      </ul>
    </nav>
  );
}
