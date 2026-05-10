"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">

      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* Topo */}
        <div className="flex justify-between items-center">

          {/* Logo */}
          <h1 className="text-xl font-bold">
            💈 BarberShop
          </h1>

          {/* Botão Mobile */}
          <button
            className="md:hidden text-3xl hover:scale-110 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"}
          </button>

          {/* Menu Desktop */}
          <ul className="hidden md:flex gap-6 font-medium">

            <li>
              <Link
                href="/"
                className="hover:text-gray-200 transition"
              >
                🏠 Início
              </Link>
            </li>

            <li>
              <Link
                href="/fila"
                className="hover:text-gray-200 transition"
              >
                📋 Fila
              </Link>
            </li>

            <li>
              <Link
                href="/novo-cliente"
                className="hover:text-gray-200 transition"
              >
                ➕ Novo Cliente
              </Link>
            </li>

            <li>
              <Link
                href="/admin"
                className="hover:text-gray-200 transition"
              >
                ⚙️ Admin
              </Link>
            </li>

          </ul>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <ul className="flex flex-col gap-4 mt-4 md:hidden bg-blue-700 p-4 rounded-xl shadow-lg animate-fadeIn">

            <li>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block hover:text-gray-200 transition"
              >
                🏠 Início
              </Link>
            </li>

            <li>
              <Link
                href="/fila"
                onClick={() => setIsOpen(false)}
                className="block hover:text-gray-200 transition"
              >
                📋 Fila
              </Link>
            </li>

            <li>
              <Link
                href="/novo-cliente"
                onClick={() => setIsOpen(false)}
                className="block hover:text-gray-200 transition"
              >
                ➕ Novo Cliente
              </Link>
            </li>

            <li>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block hover:text-gray-200 transition"
              >
                ⚙️ Admin
              </Link>
            </li>

          </ul>
        )}

      </div>
    </nav>
  );
} 