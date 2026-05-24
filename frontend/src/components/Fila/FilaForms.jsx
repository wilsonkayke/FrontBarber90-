'use client';

export default function FilaForms({
  fila,
  exit,
}) {

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

      <div className="bg-gray-100/95 shadow-2xl rounded-2xl p-8 w-full max-w-md backdrop-blur-sm">

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
    </main>
  );
}