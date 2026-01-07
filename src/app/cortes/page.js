"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CortesPage() {
  const router = useRouter();

  const imagens = [
    { src: "/imagens/Nevou.jpg", alt: "Corte Nevou" },
    { src: "/imagens/Reflexo.jpg", alt: "Corte Reflexo" },
    { src: "/imagens/Moicano.jpg", alt: "Corte Moicano" },
    { src: "/imagens/Jaca.jpg", alt: "Corte Jaca" },
  ];

  const [index, setIndex] = useState(0);

  const prevImage = () => {
    setIndex((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-[300px] h-[300px] overflow-hidden rounded-xl shadow-lg">
        <img
          src={imagens[index].src}
          alt={imagens[index].alt}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Botão anterior */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full hover:bg-opacity-80"
        >
          ❮
        </button>

        {/* Botão próximo */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full hover:bg-opacity-80"
        >
          ❯
        </button>
      </div>

      {/* Voltar */}
      <button
        onClick={() => router.push("/agenda")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        VOLTAR
      </button>
    </main>
  );
}
