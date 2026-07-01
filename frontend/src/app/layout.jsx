import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

export const metadata = {
  title: "Barbearia",
  description: "Sistema de agendamento para barbearia",
  icons: {
    icon: "/imagens/BarberFlowRedondo.png",
  }
};

export default function RootLayout({ children }) {
  return ( 
    <html lang="pt-BR">
      <body>
        {children}

        <Analytics />
        <SpeedInsights />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive" />

      </body>
    </html>
  );
} 