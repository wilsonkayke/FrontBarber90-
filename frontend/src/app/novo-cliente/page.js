"use client";
import { useState } from "react";

export default function NovoCliente() {
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("espera");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/clientes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, status }),
    });

    if (res.ok) {
      alert("Cliente cadastrado com sucesso!");
      setNome("");
    } else {
      alert("Erro ao cadastrar cliente");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Novo Cliente</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do cliente"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Adicionar
        </button>
      </form>
    </div>
  );
}
