"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AgendaLayout from "../../components/Agenda/AgendaLayout";
import AgendaTopbar from "../../components/Agenda/AgendaTopbar";

export default function Layout({ children }) {
  const router = useRouter();
  const [nomeUser, setNomeUser] = useState("");

  useEffect(() => {
    const dadosSalvo = localStorage.getItem("user");

    if (dadosSalvo) {
      try {
        const usuarioObjeto = JSON.parse(dadosSalvo);
        setNomeUser(usuarioObjeto.usuario || "");
      } catch (e) {
        console.error("Erro ao analisar o JSON do usuário:", e);
      }
    }
  }, []);

  const sair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/");
  };

  return (
    <AgendaLayout nomeUser={nomeUser} exit={sair}>
      <AgendaTopbar nomeUser={nomeUser} />

      {children}
    </AgendaLayout>
  );
}