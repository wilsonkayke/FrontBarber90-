"use client";
import { useEffect, useState } from "react";

export default function FilaPage() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/clientes/")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📋 Fila de Espera</h2>
      {clientes.length === 0 ? (
        <p>Nenhum cliente na fila.</p>
      ) : (
        <ul>
          {clientes.map((c) => (
            <li key={c.id}>{c.nome} - {c.status}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
