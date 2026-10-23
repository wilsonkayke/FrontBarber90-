export function BarberStatCard({
  title,
  value,
  icon,
  variant = "sky",
}) {
  const variants = {
    sky: {
      border: "border-sky-400/20",
      hoverBorder: "hover:border-sky-400/40",
      glow: "bg-sky-400/10",
      hoverGlow: "group-hover:bg-sky-400/20",
      value: "text-sky-400",
      shadow: "hover:shadow-sky-900/20",
    },

    emerald: {
      border: "border-emerald-400/20",
      hoverBorder: "hover:border-emerald-400/40",
      glow: "bg-emerald-400/10",
      hoverGlow: "group-hover:bg-emerald-400/20",
      value: "text-emerald-400",
      shadow: "hover:shadow-emerald-900/20",
    },

    amber: {
      border: "border-amber-400/20",
      hoverBorder: "hover:border-amber-400/40",
      glow: "bg-amber-400/10",
      hoverGlow: "group-hover:bg-amber-400/20",
      value: "text-amber-400",
      shadow: "hover:shadow-amber-900/20",
    },
  };

  const estilo = variants[variant] || variants.sky;

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        ${estilo.border}
        bg-slate-900/90
        p-5
        shadow-xl
        transition-all
        duration-200
        hover:-translate-y-1
        ${estilo.hoverBorder}
        ${estilo.shadow}
      `}
    >
      {/* Brilho decorativo */}
      <div
        className={`
          absolute
          -right-8
          -top-8
          h-24
          w-24
          rounded-full
          ${estilo.glow}
          blur-2xl
          transition-all
          duration-300
          ${estilo.hoverGlow}
        `}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-widest text-slate-400">
            {title}
          </p>

          {icon && (
            <span className="text-lg opacity-80">
              {icon}
            </span>
          )}
        </div>

        <h3
          className={`
            mt-2
            text-3xl
            font-black
            ${estilo.value}
          `}
        >
          {value}
        </h3>
      </div>
    </div>
  );
}