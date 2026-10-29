"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Topbarbarber() {
  const [userName, setUserName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const sair = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 2. Opcional: Se ainda usar o localStorage para outras coisas, limpe-o também
    localStorage.removeItem('token');

    // 3. Força um redirecionamento limpo
    router.refresh(); // Limpa caches locais do Next.js
    router.push("/login");
     
  };

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
            <button
            onClick={() => setIsOpen(!isOpen)}
            className="left-0"
            >
                ☰
            </button>
        </div>

        {/* Lado direito */}
        <div className="z-10 flex items-center gap-4">
          <button
          onClick={sair}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors"
          >
            Sair
          </button>
        </div>

      </div>
    </header>
  );
}