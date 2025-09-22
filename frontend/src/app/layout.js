import "./globals.css";

export const metadata = {
  title: "Barbearia",
  description: "Sistema de agendamento para barbearia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
