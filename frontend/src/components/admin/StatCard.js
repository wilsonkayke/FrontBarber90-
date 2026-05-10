"use client";
import React from "react";

export default function StatCard({ title, value }) {
   return (
    <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all border">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2 text-slate-800">
        {value}
      </h3>

    </div>
  );
}
