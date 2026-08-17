"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AgendaForm from "../../components/Agenda/AgendaForms";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AgendaPage() {
  const router = useRouter(); 
  const [data, setData] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [servico, setServico] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [msgErro, setMsgErro] = useState("");
  
  // 🆕 STATE ADICIONADO: Controla os alertas de fila
  const [alertaFila, setAlertaFila] = useState(null);

  const horariosFixos = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30",
  ];

  const servicos = [
    { id: 1, nome: "Corte de cabelo", duracao: "15 minutos", preco: 30 },
    { id: 2, nome: "Barba", duracao: "10 minutos", preco: 15 },
    { id: 3, nome: "Corte e barba", duracao: "30 minutos", preco: 40 },
    { id: 4, nome: "Corte infantil", duracao: "20 minutos", preco: 25 },
    { id: 5, nome: "Sobrancelha", duracao: "5 minutos", preco: 5 },
  ];

  // HORÁRIOS DISPONÍVEIS
  const [horariosDisponiveis, setHorariosDisponiveis] = useState(
    horariosFixos.map((hora) => ({
      hora,
      ocupado: false,
    })),
  );

  // 🆕 EFFECT ADICIONADO: Intercepta o usuário que reabriu a aba
  useEffect(() => {
  const agendamentoId = localStorage.getItem("id_agendamento");
  if (!agendamentoId) return;

  const checarStatusFila = async () => {
    try {
      const resposta = await fetch(`${API_URL}/agendamentos/${agendamentoId}/status`);
      if (!resposta.ok) {
        localStorage.removeItem("id_agendamento");
        return;
      }

      const dados = await resposta.json();

      // TESTE 1: Ainda não foi chamado. Volta para a fila.
      if (dados.status === "agendado") {
        router.push("/fila");
        return;
      }

      // TESTE 2 e 3: O barbeiro chamou!
      if (dados.status === "em_atendimento" && dados.minutos_passados !== null) {
        
        // Garante que o valor nunca seja negativo por delay de rede
        const minutos = Math.max(0, dados.minutos_passados);

        if (minutos <= 15) {
          setAlertaFila({
            mensagem: `🚨 Corre! Você foi chamado há ${minutos} minutos. Se desloque até a barbearia! (75)9 9293-9090`,
            tipo: "chamado"
          });
        } else {
          setAlertaFila({
            mensagem: `⚠️ Você foi chamado anteriormente (há ${minutos} minutos), mas o tempo limite de espera expirou.`,
            tipo: "atraso"
          });
        }

        // Limpa o ID para permitir novos agendamentos futuros
        localStorage.removeItem("id_agendamento");
      }
    } catch (erro) {
      console.error("Erro na checagem da fila:", erro);
      localStorage.removeItem("id_agendamento");
    }
  };

  checarStatusFila();
}, [router]);
  // BUSCAR HORÁRIOS OCUPADOS (Mantido original)
  useEffect(() => { 
    if (!data) {
      setHorariosDisponiveis(horariosFixos);
      return;
    }

    const buscarHorarios = async () => {
      try { 
        const resposta = await fetch(
          `${API_URL}/agendamentos/horarios?data=${data}`,
        );

        const dados = await resposta.json();
        const horariosOcupados = Array.isArray(dados) ? dados : [];

        setHorariosDisponiveis(
          horariosFixos.map((horario) => ({
            hora: horario,
            ocupado: horariosOcupados.includes(horario),
          })),
        );
      } catch (erro) {  
        console.error(erro);
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

    if (!data || !horarioSelecionado ) {
      setMsgErro("Escolha uma data, um horário e um serviço!");
      return;
    }

    try { 
      const token = localStorage.getItem("token");
      const [ano, mes, dia] = data.split("-");
      const [horaSel, minutoSel] = horarioSelecionado.split(":");

      const dataLocal = new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        Number(horaSel),
        Number(minutoSel),
      );

      const resposta = await fetch(`${API_URL}/agendamentos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          horario: dataLocal.toISOString(),
          servico_id: Number(servico),
        }),
      });

      if (!resposta.ok) {
        const erroBackend = await resposta.json();
        console.log("ERRO BACKEND:", erroBackend);

        setMsgErro(
          Array.isArray(erroBackend.detail)
            ? erroBackend.detail[0].msg
            : erroBackend.detail || "Erro ao realizar agendamento",
        );
        return;
      }

      // 🔑 MODIFICAÇÃO DE SUCESSO AQUI:
      const dadosSucesso = await resposta.json(); // Captura o JSON de retorno
      setMsgSucesso("Agendamento realizado com sucesso!");

      // Salva o `agendamento_id` string gerado pelo MongoDB Atlas
      localStorage.setItem("id_agendamento", dadosSucesso.agendamento_id);

      setData("");
      setHorarioSelecionado("");
      setServico("");

      // REDIRECIONAR
      setTimeout(() => {
        router.push("/fila"); 
      }, 2000); 
    } catch (erro) {
      console.error(erro);  
      setMsgErro("Erro ao conectar com o servidor");
    }
  };

  return (
    <AgendaForm
      data={data} 
      setData={setData}
      servico={servico}
      setServico={setServico}
      servicos={servicos}
      horarios={horariosDisponiveis}
      horarioSelecionado={horarioSelecionado}
      setHorarioSelecionado={setHorarioSelecionado}
      msgErro={msgErro}
      msgSucesso={msgSucesso}
      handleAgendar={handleAgendar} 
      exit={() => router.push("/")}
      // 🆕 PROP PASSADA: Disponibiliza o estado para o componente interno renderizar
      alertaFila={alertaFila} 
    />
  );
}