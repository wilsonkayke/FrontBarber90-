import "./globals.css";

export const metadata = {
  title: "Barber Queue",
  description: "Sistema de agendamento para barbearia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
