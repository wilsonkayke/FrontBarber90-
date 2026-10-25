import { BarberForms } from "./BarberForms";
import { BarberStatCard } from "./StatCard";
import { Topbarbarber } from "./Topbarbarber";
import { Statistic } from "./Statistic";

import { Scissors, DollarSign, Users } from "lucide-react";

export function LayoutBarber({
  data = [],
  faturamentoHoje = 0,
  servicos = [],
  dadosAtendimentos = [],
  dadosServicos = [],

  diaSelecionado,
  setDiaSelecionado,
  datasDisponiveis,

  mostrarCalendario,
  setMostrarCalendario,

  onChamar,
  onFinalizar,

  carregando,
  erro,
}) {
  return (
    <main className="min-h-screen bg-slate-950">
      <Topbarbarber />

      <section className="px-4 pt-28 pb-10 sm:px-6 lg:px-10">
        {/* Indicadores */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <BarberStatCard
            title="ATENDIMENTOS"
            value={dadosAtendimentos.reduce(
              (total, item) => total + (item.total_finalizados || 0),
              0,
            )}
            icon={Scissors}
            variant="sky"
          />

          <BarberStatCard
            title="FATURAMENTO"
            value={faturamentoHoje}
            icon={DollarSign}
            variant="emerald"
          />

          <BarberStatCard
            title="AGUARDANDO"
            value={data.length}
            icon={Users}
            variant="amber"
          />
        </div>

        {/* Atendimentos */}
        <div className="mb-10">
          <BarberForms
            data={data}
            faturamentoHoje={faturamentoHoje}
            servicos={servicos}
            diaSelecionado={diaSelecionado}
            setDiaSelecionado={setDiaSelecionado}
            datasDisponiveis={datasDisponiveis}
            mostrarCalendario={mostrarCalendario}
            setMostrarCalendario={setMostrarCalendario}
            onChamar={onChamar}
            onFinalizar={onFinalizar}
            carregando={carregando}
            erro={erro}
          />
        </div>

        {/* Estatísticas */}
        <div>
          <Statistic
            dadosAtendimentos={dadosAtendimentos}
            dadosServicos={dadosServicos}
          />
        </div>
      </section>
    </main>
  );
}
