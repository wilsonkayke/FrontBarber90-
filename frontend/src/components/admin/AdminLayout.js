"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }) {
   return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

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