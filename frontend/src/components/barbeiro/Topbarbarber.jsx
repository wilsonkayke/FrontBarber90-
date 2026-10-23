"use client";

import React, { useEffect, useState } from "react";

export function Topbarbarber() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("usuario");

    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <header className="fixed top-2 left-2 right-2 md:left-25 md:right-25 z-50 flex items-center gap-4">
      <div className="relative flex w-full items-center justify-between rounded-3xl px-6 py-4">

        {/* Fundo */}
        <div
          className="
            absolute
            inset-0
            -z-10
            rounded-3xl
            bg-gray-200/30
            shadow-md
            backdrop-blur-sm
            pointer-events-none
          "
        />

        {/* Logo */}
        <div className="z-10 font-bold text-black">
          💈 BarberFlow
        </div>

        {/* Nome do barbeiro */}
        <div className="z-10">
          <span className="text-sm font-bold text-gray-800">
            {userName || "Barbeiro"}
          </span>
        </div>

        {/* Lado direito */}
        <div className="z-10 flex items-center gap-4">
          {/* Futuramente:
              - botão sair
              - menu
              - perfil
          */}
        </div>

      </div>
    </header>
  );
}