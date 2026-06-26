from pathlib import Path
import os
import resend
from dotenv import load_dotenv

# 1. Encontra a raiz do projeto subindo duas pastas a partir deste arquivo (utils -> app -> backend)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# 2. Aponta exatamente para o arquivo dentro da pasta frontend
# Isso vai gerar o caminho: C:\...\FrontBarber90-\frontend\.env.local
PATH_TO_ENV = BASE_DIR.parent / "frontend" / ".env.local"

# 3. Carrega o arquivo apontando para o lugar correto
load_dotenv(dotenv_path=PATH_TO_ENV)


def send_reset_email(to_email: str, reset_link: str):
    resend.api_key = os.getenv("RESEND_API_KEY")

    if not resend.api_key:
        print(f"ERRO: Não encontrei a chave no caminho: {PATH_TO_ENV}")
    else:
        print(f"Chave carregada da pasta frontend! Início: {resend.api_key[:10]}...")

    params = {
        "from": "onboarding@resend.dev",
        "to": lenevangelista86@gmail.com,
        "subject": "Redefinição de senha",
        "html": f"""
            <h2>Redefinição de senha</h2>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <a href="{reset_link}">Redefinir senha</a>
        """,
    }

    r = resend.Emails.send(params)
    return r

