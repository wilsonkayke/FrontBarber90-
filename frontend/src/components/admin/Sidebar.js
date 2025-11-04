"use client"

import React from "react";
import Link from "next/link";

const items = [
    {href: "/admin", label: "Dashboard" },
    {href: "/admin/clientes", label: "Clientes" },
    {href: "/admin/fila", label: "Fila" },
    {href: "/admin/servicos", label: "Serviços" },
    {href: "/admin/config", label: "Configurações" },
];

export default function Sidebar () {
    return (
        <aside className="w-60 bg-white border-r hidden med:block">
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold">Barbearia Admin</h1>
            </div>
            <nav className="p-4">
                <ul className="space-y-2">
                    {items.map((it) => (
                        <li key={it.href}>
                            <a className="block px-3 py-2 rounded hover:bg-gray-100">
                                {it.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}