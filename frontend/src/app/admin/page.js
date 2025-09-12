export default function AdminPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Painel Administrativo</h1>
        <p className="text-gray-700 text-center">
          Bem-vindo ao painel admin! Aqui você pode gerenciar usuários, agenda e cortes.
        </p>
      </div>
    </main>
  );
}
