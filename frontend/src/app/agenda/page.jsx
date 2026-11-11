
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAgenda } from "../../components/Agenda/AgendaLayout";

import AgendaForm from "../../components/Agenda/AgendaForms";
import AgendaRelatorio from "../../components/Agenda/AgendaRelatorio";  

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function AgendaContent({
  data,
  setData,
  servico,
  setServico,
  servicos,
  barbeiro,
  setBarbeiro,
  barbeiros,
  carregandoBarbeiros,
  horariosDisponiveis,
  horarioSelecionado,
  setHorarioSelecionado,
  msgErro,
  msgSucesso,
  handleAgendar,
  alertaFila,
  nomeUser,
  menuAberto,
  alternarMenu,
}) {
  const { currentAction } = useAgenda();

  if (currentAction === "Historico") {
    return <AgendaRelatorio />;
  }

  return (
    <AgendaForm
      data={data}
      setData={setData}
      servico={servico}
      setServico={setServico}
      servicos={servicos}
      barbeiro={barbeiro}
      setBarbeiro={setBarbeiro}
      barbeiros={barbeiros}
      carregandoBarbeiros={carregandoBarbeiros}
      horarios={horariosDisponiveis}
      horarioSelecionado={horarioSelecionado}
      setHorarioSelecionado={setHorarioSelecionado}
      msgErro={msgErro}
      msgSucesso={msgSucesso}
      handleAgendar={handleAgendar}
      exit={() => {}}
      alertaFila={alertaFila}
      nomeUser={nomeUser}
      isOpen={menuAberto}
      onClose={alternarMenu}
    />
  );
}

export default function AgendaPage() {
  const router = useRouter();

  // ESTADOS DO AGENDAMENTO
  const [data, setData] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] =
    useState("");

  const [servico, setServico] = useState("");
  const [barbeiro, setBarbeiro] = useState("");

  const [barbeiros, setBarbeiros] = useState([]);
  const [carregandoBarbeiros, setCarregandoBarbeiros] =
    useState(true);

  const [msgSucesso, setMsgSucesso] = useState("");
  const [msgErro, setMsgErro] = useState("");

  const [menuAberto, setMenuAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [nomeUser, setNomeUser] = useState("");

  const [alertaFila, setAlertaFila] = useState(null);

  // CARREGAR NOME DO USUÁRIO
  useEffect(() => {
    const dadosSalvo = localStorage.getItem("user");

    if (dadosSalvo) {
      try {
        const usuarioObjeto = JSON.parse(dadosSalvo);

        setNomeUser(usuarioObjeto.usuario || "");
      } catch (erro) {
        console.error(
          "Erro ao analisar os dados do usuário:",
          erro
        );
      }
    }
  }, []);

  function alternarMenu() {
    setMenuAberto((anterior) => !anterior);
  }

  // HORÁRIOS FIXOS DA BARBEARIA
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

  // SERVIÇOS DA BARBEARIA
  const servicos = [
    {
      id: 1,
      nome: "Corte de cabelo",
      duracao: "15 minutos",
      preco: 30,
    },
    {
      id: 2,
      nome: "Barba",
      duracao: "10 minutos",
      preco: 15,
    },
    {
      id: 3,
      nome: "Corte e barba",
      duracao: "20 minutos",
      preco: 45,
    },
    {
      id: 4,
      nome: "Corte infantil",
      duracao: "20 minutos",
      preco: 25,
    },
    {
      id: 5,
      nome: "Sobrancelha",
      duracao: "5 minutos",
      preco: 5,
    },
  ];

  // HORÁRIOS DISPONÍVEIS
  // Começa vazio até a consulta ser realizada
  const [
    horariosDisponiveis,
    setHorariosDisponiveis,
  ] = useState([]);

  // VERIFICAR STATUS DA FILA
  useEffect(() => {
    const agendamentoId = localStorage.getItem(
      "id_agendamento"
    );

    if (!agendamentoId) return;

    const checarStatusFila = async () => {
      try {
        const resposta = await fetch(
          `${API_URL}/agendamentos/${agendamentoId}/status`
        );

        if (!resposta.ok) {
          localStorage.removeItem("id_agendamento");
          return;
        }

        const dados = await resposta.json();

        if (dados.status === "agendado") {
          router.push("/fila");
          return;
        }

        if (
          dados.status === "em_atendimento" &&
          dados.minutos_passados !== null
        ) {
          const minutos = Math.max(
            0,
            dados.minutos_passados
          );

          if (minutos <= 15) {
            setAlertaFila({
              mensagem: `🚨 Corre! Você foi chamado há ${minutos} minutos. Se desloque até a barbearia! (75)9 9293-9090`,
              tipo: "chamado",
            });
          } else {
            setAlertaFila({
              mensagem: `⚠️ Você foi chamado anteriormente (há ${minutos} minutos), mas o tempo limite de espera expirou.`,
              tipo: "atraso",
            });
          }

          localStorage.removeItem("id_agendamento");
        }
      } catch (erro) {
        console.error(
          "Erro na checagem da fila:",
          erro
        );

        localStorage.removeItem("id_agendamento");
      }
    };

    checarStatusFila();
  }, [router]);

  // ============================================
  // CONSULTAR HORÁRIOS OCUPADOS POR BARBEIRO
  // ============================================
  useEffect(() => {
    let active = true;

    // Limpa seleção anterior
    setHorarioSelecionado("");
    setHorariosDisponiveis([]);
    setMsgErro("");

    // Só consulta quando data e barbeiro existem
    if (!data || !barbeiro) {
      setCarregando(false);
      return;
    }

    const buscarHorarios = async () => {
      try {
        setCarregando(true);

        const params = new URLSearchParams({
          data,
          barber_id: barbeiro,
        });

        const resposta = await fetch(
          `${API_URL}/agendamentos/horarios?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível consultar os horários."
          );
        }

        const dados = await resposta.json();

        console.log("HORÁRIOS DA API:", dados);

        if (!Array.isArray(dados)) {
          throw new Error(
            "Formato inválido dos horários retornados."
          );
        }

        if (active) {
          const horariosAtualizados = horariosFixos.map(
            (hora) => ({
              hora,
              ocupado: dados.includes(hora),
            })
          );

          setHorariosDisponiveis(horariosAtualizados);
        }
      } catch (erro) {
        console.error(
          "Erro ao buscar horários:",
          erro
        );

        if (active) {
          // Não libera horários se a API falhar
          setHorariosDisponiveis([]);

          setMsgErro(
            erro.message ||
              "Erro ao consultar os horários."
          );
        }
      } finally {
        if (active) {
          setCarregando(false);
        }
      }
    };

    buscarHorarios();

    // Impede que uma requisição antiga sobrescreva
    // os horários após mudar data ou barbeiro
    return () => {
      active = false;
    };
  }, [data, barbeiro]);

  // ============================================
  // BUSCAR BARBEIROS ATIVOS
  // ============================================
  useEffect(() => {
    let ativo = true;

    async function buscarBarbeiros() {
      try {
        const token = localStorage.getItem("token");

        const resposta = await fetch(
          `${API_URL}/barbeiros/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resposta.ok) {
          throw new Error(
            "Não foi possível carregar os barbeiros."
          );
        }

        const dados = await resposta.json();

        if (ativo) {
          setBarbeiros(
            Array.isArray(dados) ? dados : []
          );
        }
      } catch (erro) {
        console.error(
          "Erro ao buscar barbeiros:",
          erro
        );

        if (ativo) {
          setMsgErro(
            "Não foi possível carregar os barbeiros."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoBarbeiros(false);
        }
      }
    }

    buscarBarbeiros();

    return () => {
      ativo = false;
    };
  }, []);

  // ============================================
  // REALIZAR AGENDAMENTO
  // ============================================
  const handleAgendar = async (e) => {
    e.preventDefault();

    setMsgErro("");
    setMsgSucesso("");

    // Valida campos obrigatórios
    if (
      !data ||
      !horarioSelecionado ||
      !servico ||
      !barbeiro
    ) {
      setMsgErro(
        "Escolha uma data, horário, serviço e barbeiro!"
      );
      return;
    }

    // Impede agendamento sem disponibilidade validada
    const horarioLivre = horariosDisponiveis.some(
      (item) =>
        item.hora === horarioSelecionado &&
        !item.ocupado
    );

    if (carregando || !horarioLivre) {
      setMsgErro(
        "Aguarde a consulta e escolha um horário disponível."
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
            servico_id: Number(servico),
            barber_id: barbeiro,
          }),
        }
      );

      if (!resposta.ok) {
        const erroBackend = await resposta.json();

        console.log("ERRO BACKEND:", erroBackend);

        setMsgErro(
          Array.isArray(erroBackend.detail)
            ? erroBackend.detail[0].msg
            : erroBackend.detail ||
                "Erro ao realizar agendamento"
        );

        return;
      }

      const dadosSucesso = await resposta.json();

      setMsgSucesso(
        "Agendamento realizado com sucesso!"
      );

      // Armazena ID do agendamento
      localStorage.setItem(
        "id_agendamento",
        dadosSucesso.agendamento_id
      );

      // Limpa formulário
      setData("");
      setHorarioSelecionado("");
      setServico("");
      setBarbeiro("");

      // Redireciona para a fila
      setTimeout(() => {
        router.push("/fila");
      }, 2000);
    } catch (erro) {
      console.error(
        "Erro ao realizar agendamento:",
        erro
      );

      setMsgErro(
        "Erro ao conectar com o servidor"
      );
    }
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  return (
    <AgendaContent
      data={data}
      setData={setData}
      servico={servico}
      setServico={setServico}
      servicos={servicos}
      barbeiro={barbeiro}
      setBarbeiro={setBarbeiro}
      barbeiros={barbeiros}
      carregandoBarbeiros={carregandoBarbeiros}
      horariosDisponiveis={horariosDisponiveis}
      horarioSelecionado={horarioSelecionado}
      setHorarioSelecionado={setHorarioSelecionado}
      msgErro={msgErro}
      msgSucesso={msgSucesso}
      handleAgendar={handleAgendar}
      alertaFila={alertaFila}
      nomeUser={nomeUser}
      menuAberto={menuAberto}
      alternarMenu={alternarMenu}
    />
  );
}
