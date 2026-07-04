"use client";

import React, { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
   return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform bg-slate-900 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <Topbar />

        {/* Página */}
        <main className="p-4 sm:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}