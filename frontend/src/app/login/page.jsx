"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import LoginForms from "../../components/Login/LoginForms";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msgErro, setMsgErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const googleInicializado = useRef(false);

  // 🆕 FUNÇÃO ADICIONADA: Decide para qual tela mandar o cliente após logar
  
const gerenciarRedirecionamentoPosLogin = async (user) => {
  const role = user.role?.trim().toLowerCase();

  // 1. Administrador
  if (role === "admin") {
    router.replace("/admin");
    return;
  }

  // 2. Barbeiro
  if (role === "barbeiro") {
    router.replace("/barbeiro");
    return;
  }

  // 3. Cliente
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }
    
    const response = await fetch(
      `${API_URL}/agendamentos/meu-agendamento`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (response.status === 401 || response.status === 403) {
      router.replace("/login");
      return;
    }

    if (!response.ok) {
      throw new Error(
        `Erro ao consultar agendamento: ${response.status}`
      );
    }

    const dados = await response.json();
    const agendamento = dados.agendamento;

    if (
      agendamento &&
      ["agendado", "na_fila", "aguardando", "em_atendimento"]
        .includes(agendamento.status)
    ) {
      router.replace("/fila");
      return;
    }

    // Cliente não possui agendamento ativo
    router.replace("/agenda");

  } catch (error) {
    console.error("Erro ao verificar agendamento:", error);

    // Não presumir que o cliente está sem agendamento
    // quando o backend está indisponível.
    alert(
      "Não foi possível verificar seu agendamento. Tente novamente."
    );
  }
};


  const inicializarEBotarGoogle = () => {
    if (
      !window.google?.accounts?.id ||
      !document.getElementById("googleButton")
    ) {
      return;
    }

    try {
      if (!googleInicializado.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });
        googleInicializado.current = true;
      }

      window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { theme: "outline", size: "large", width: "100%" },
      );
    } catch (error) {
      console.error("Erro ao renderizar botão do Google:", error);
    }
  };

  useEffect(() => {
    inicializarEBotarGoogle();

    const intervalo = setInterval(() => {
      if (
        window.google?.accounts?.id &&
        document.getElementById("googleButton")
      ) {
        inicializarEBotarGoogle();
        clearInterval(intervalo);
      }
    }, 300);

    return () => clearInterval(intervalo);
  }, []);

  // CALLBACK GOOGLE
  const handleGoogleLogin = async (response) => {
    try {
      const googleToken = response.credential;

      const req = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await req.json();

      if (!req.ok) {
        setMsgErro(data.detail || "Erro login Google");
        return;
      }

      // 🔑 AJUSTE GOOGLE: Preserva o id_agendamento caso ele exista
      const idSalvo = localStorage.getItem("id_agendamento");

      localStorage.clear();

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (idSalvo) {
          localStorage.setItem("id_agendamento", idSalvo);
      }

      // Dispara o redirecionamento inteligente
      await gerenciarRedirecionamentoPosLogin(data.user);
    } catch (error) {
      console.error(error);
      setMsgErro("Erro ao conectar");
    }
  };

  // LOGIN NORMAL
  const entrar = async () => {
    setMsgErro("");
    setMsgSucesso("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const erros = data.detail.map((err) => err.msg).join(", ");
          setMsgErro(erros);
        } else {
          setMsgErro(data.detail || "Email ou senha inválidos");
        }
        return;
      }

      // 🔑 MODIFICAÇÃO CIRÚRGICA AQUI:
      // Em vez de dar um clear total e apagar a nossa fila, nós guardamos o ID antes de limpar
      const idFilaExistente = localStorage.getItem("id_agendamento");

      localStorage.clear(); // Limpa tokens velhos

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      if (idFilaExistente) {
        localStorage.setItem("id_agendamento", idFilaExistente);
      }

      setMsgSucesso("Login realizado com sucesso!");

      // Executa a nossa checagem inteligente de rotas após 1 segundo
      setTimeout(async () => {
        await gerenciarRedirecionamentoPosLogin(data.user);
      }, 1000); 
    } catch (error) {
      console.error(error);
      setMsgErro("Erro ao conectar com servidor");
    }
  };

  return (
    <>
      <Script
        src="https://google.com"
        strategy="afterInteractive"
        onLoad={inicializarEBotarGoogle}
      />

      <LoginForms
        email={email}
        senha={senha}
        setEmail={setEmail}
        setSenha={setSenha}
        mostrarSenha={mostrarSenha}
        setMostrarSenha={setMostrarSenha}
        msgErro={msgErro}
        msgSucesso={msgSucesso}
        entrar={entrar}
      />
    </>
  );
}
