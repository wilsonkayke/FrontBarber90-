"use client";

export default function FilaPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        {/* Título */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Acompanhamento da Fila
        </h1>

        {/* Posição atual */}
        <div className="bg-blue-100 border border-blue-300 text-blue-700 font-semibold text-center rounded-lg p-4 mb-6">
          Sua posição atual: 3
        </div>

        {/* Clientes à frente */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">
            Clientes à sua frente:
          </h2>

          <div className="space-y-3">
            <div className="bg-gray-200 rounded-lg p-3 flex justify-between items-center">
              <span>1. João</span>
              <span className="text-sm text-gray-600">Aguardando...</span>
            </div>

            <div className="bg-gray-200 rounded-lg p-3 flex justify-between items-center">
              <span>2. Carlos</span>
              <span className="text-sm text-gray-600">Aguardando...</span>
            </div>
          </div>
        </div>

        {/* Informações do atendimento */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="font-semibold mb-1">
            Informações do atendimento
          </h2>
          <p className="text-sm text-gray-700">
            Existem 2 clientes antes de você.
          </p>
        </div>

      </div>
    </main>
  );
}
