"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CadastroForms from "../../components/Cadastro/CadastroForms";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CadastroPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [msgErro, setMsgErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const validarFormulario = () => {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regexEmail.test(email)) {
      setMsgErro("Email inválido.");
      return false;
    }

    if (usuario.length < 5) {
      setMsgErro("Usuário deve ter pelo menos 5 caracteres.");
      return false;
    }

    if (senha.length < 6) {
      setMsgErro("Senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (senha.length > 72) {
      setMsgErro("Senha muito longa.");
      return false;
    }

    if (senha !== confirmarSenha) {
      setMsgErro("As senhas não conferem.");
      return false;
    }

    setMsgErro("");
    return true;
  };

  const cadastrar = async () => {
    if (!validarFormulario()) return;

    try {
      const response = await fetch(
        "https://barber-edxf.onrender.com/clientes/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            usuario,
            senha,
            confirmar_senha: confirmarSenha,
          }),
        },
      );

      const text = await response.text();

      console.log("STATUS:", response.status);
      console.log("RAW RESPONSE:", text);

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (jsonError) {
        console.error("Erro ao converter JSON:", jsonError);
      }

      if (!response.ok) {
        setMsgErro(data.detail || "Erro ao cadastrar");
        setMsgSucesso("");
        return;
      }

      setMsgSucesso("Cadastro feito com sucesso!");
      setMsgErro("");

      setTimeout(() => {
        router.push("/agenda");
      }, 1500);
    } catch (error) {
      console.error("ERRO COMPLETO:", error);

      if (error instanceof Error) {
        setMsgErro(error.message);
      } else {
        setMsgErro("Erro desconhecido");
      }
    }
  };

  return (
    
    < CadastroForms
    
    email={email}
    setEmail={setEmail}
    usuario={usuario}
    setUsuario={setUsuario}
    senha={senha}
    setSenha={setSenha}
    confirmarSenha={confirmarSenha}
    setConfirmarSenha={setConfirmarSenha}
    mostrarSenha={mostrarSenha}
    setMostrarSenha={setMostrarSenha}
    mostrarConfirmarSenha={mostrarConfirmarSenha}
    setMostrarConfirmarSenha={setMostrarConfirmarSenha}
    msgErro={msgErro}
    msgSucesso={msgSucesso}
    cadastrar={cadastrar}

    />
  );
} 
