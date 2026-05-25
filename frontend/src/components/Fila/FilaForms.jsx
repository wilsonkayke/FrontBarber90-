'use client';

import { useState } from "react";

export default function FilaForms({
  fila,
  exit,
}) {

  const imagens = [
    "/imagens/jaca.jpg",
    "/imagens/Reflexo.jpg",
    "/imagens/Nevou.jpg",
    "/imagens/Moicano.jpg",
  ]

  const [index, setIndex] = useState(0);

  const proximo = () => {
    setIndex((prev) =>
      prev === imagens.length - 1 ? 0 : prev + 1
    );
  };

  const anterior = () => {
    setIndex((prev) =>
      prev === 0 ? imagens.length - 1 : prev - 1
    );
  };

  return (
    <main
      style={{
        backgroundImage: "url('/imagens/principal.jpg')"
      }}
      className="
        bg-cover
        bg-center
        bg-no-repeat
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        py-4 
      "
    >

      <div className="bg-gray-100/95 flex flex-col shadow-2xl rounded-2xl p-5 mb-50 w-full max-w-md backdrop-blur-sm gap-4">

        <h1 className="text-2xl font-bold text-center mb-6">
          Acompanhamento da Fila
        </h1>

        {!fila ? (

          <p className="text-center text-gray-600">
            Carregando...
          </p>

        ) : fila.posicao === null ? (

          <p className="text-center text-gray-600">
            Você foi chamado
          </p>

        ) : (

          <div className="space-y-3 text-center">

            <p className="text-lg font-semibold">
              Sua posição: {fila.posicao}°
            </p>

            <p>
              Pessoas à frente: {fila.pessoas_a_frente}
            </p>

            <p>
              Total na fila: {fila.total_na_fila}
            </p>

            <button
              onClick={exit}
              className="
                bg-red-700
                text-white
                px-4
                py-2
                rounded-xl
                hover:bg-red-800
                transition
              "
            >
              Sair
            </button>

          </div>
        )}

      </div>
      
      {/* Imagem Carrossel */}
      <div className="flex
        flex-col
        items-center
        gap-3
        absolute
        bottom-5
        right-5">

        <img
          src={imagens[index]}
          alt="carousel"
          className="w-48 h-48 object-cover rounded-full shadow-lg"
        />

        <div className="flex gap-2">
          <button
            onClick={anterior}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition"
          >
            Anterior
          </button>
          <button
            onClick={proximo}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition"
          >
            {/*→*/}
            Próximo
          </button>
        </div>

        
      </div>
        

    </main>
  );
}