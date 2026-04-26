import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Barbearia",
  description: "Sistema de agendamento para barbearia",
};

export default function RootLayout({ children }) {
  <Analytics />
  
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
