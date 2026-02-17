"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/fila", label: "Fila" },
  { href: "/admin/servicos", label: "Serviços" },
  { href: "/admin/config", label: "Configurações" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-5 text-xl font-bold border-b border-slate-700">
        Admin
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition ${
                    active
                      ? "bg-slate-700"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
