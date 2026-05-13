"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AgendaForm from "../../components/Agenda/AgendaForms";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AgendaPage() {

  const router = useRouter();

  // DATA
  const [data, setData] = useState("");

  // HORÁRIO SELECIONADO
  const [horarioSelecionado, setHorarioSelecionado] =
    useState("");

  // HORÁRIOS DISPONÍVEIS
  const [horariosDisponiveis, setHorariosDisponiveis] =
    useState([]);

  // MENSAGENS
  const [msgSucesso, setMsgSucesso] = useState("");
  const [msgErro, setMsgErro] = useState("");

  // TODOS OS HORÁRIOS
  const horariosFixos = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  // BUSCAR HORÁRIOS OCUPADOS
  useEffect(() => {

    if (!data) return;

    const buscarHorarios = async () => {

      try {

        const resposta = await fetch(
          `${API_URL}/agendamentos/horarios?data=${data}`
        );

        const dados = await resposta.json();

        // EXEMPLO BACKEND:
        // ["08:00", "09:30"]

        const horariosOcupados = Array.isArray(dados)
          ? dados
          : [];

        // FILTRAR
        const livres = horariosFixos.filter(
          (horario) =>
            !horariosOcupados.includes(horario)
        );

        setHorariosDisponiveis(livres);

      } catch (erro) {

        console.error(erro);

        // SE DER ERRO, MOSTRA TODOS
        setHorariosDisponiveis(horariosFixos);
      }
    };

    buscarHorarios();

  }, [data]);

  // AGENDAR
  const handleAgendar = async (e) => {

    e.preventDefault();

    setMsgErro("");
    setMsgSucesso("");

    if (!data || !horarioSelecionado) {

      setMsgErro(
        "Escolha uma data e um horário!"
      );

      return;
    }

    try {

      const token = localStorage.getItem("token");

      const [ano, mes, dia] = data.split("-");

      const [horaSel, minutoSel] =
        horarioSelecionado.split(":");

      const dataLocal = new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        Number(horaSel),
        Number(minutoSel)
      );

      const resposta = await fetch(
        `${API_URL}/agendamentos/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            horario: dataLocal.toISOString(),
          }),
        }
      );

      if (!resposta.ok) {

        const erroBackend =
          await resposta.json();

        console.log(
          "ERRO BACKEND:",
          erroBackend
        );

        setMsgErro(
          erroBackend.detail ||
            "Erro ao realizar agendamento"
        );

        return;
      }

      // SUCESSO
      setMsgSucesso(
        "Agendamento realizado com sucesso!"
      );

      setData("");
      setHorarioSelecionado("");

      // REDIRECIONAR
      setTimeout(() => {

        router.push("/fila");

      }, 2000);

    } catch (erro) {

      console.error(erro);

      setMsgErro(
        "Erro ao conectar com o servidor"
      );
    }
  };

  return (
    <AgendaForm
      // DATA
      data={data}
      setData={setData}

      // HORÁRIOS
      horarios={horariosDisponiveis}

      horarioSelecionado={
        horarioSelecionado
      }

      setHorarioSelecionado={
        setHorarioSelecionado
      }

      // MENSAGENS
      msgErro={msgErro}
      msgSucesso={msgSucesso}

      // FUNÇÃO
      handleAgendar={handleAgendar}
    />
  );
}