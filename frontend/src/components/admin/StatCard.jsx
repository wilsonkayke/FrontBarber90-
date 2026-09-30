"use client";
import React from "react";

export default function StatCard({ title, value }) {
  return (
    <div
  className="
    group
    relative
    overflow-hidden
    rounded-2xl
    border border-sky-400/20
    bg-slate-900/90
    p-5
    shadow-xl
    transition-all
    duration-200
    hover:-translate-y-1
    hover:border-sky-400/40
    hover:shadow-sky-900/20
  "
>
  {/* Brilho decorativo */}
  <div
    className="
      absolute
      -right-8
      -top-8
      h-24
      w-24
      rounded-full
      bg-sky-400/10
      blur-2xl
      transition-all
      duration-300
      group-hover:bg-sky-400/20
    "
  />

  <div className="relative">
    <p className="text-xs font-bold tracking-widest text-slate-400">
      {title}
    </p>

    <h3 className="mt-2 text-3xl font-black text-white">
      {value}
    </h3>
  </div>
</div>
  );
}
