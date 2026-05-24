import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Barbearia",
  description: "Sistema de agendamento para barbearia",
};

export default function RootLayout({ children }) {
  return ( 
    <html lang="pt-BR">
      <body>
        {children}

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
} 