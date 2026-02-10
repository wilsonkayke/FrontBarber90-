"use client";
import React from "react";

export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-gray-500">{title}</div>
          <div className="mt-1 text-2xl font-bold">{value}</div>
          {subtitle && <div className="mt-2 text-sm text-gray-500">{subtitle}</div>}
        </div>
        {icon && <div className="ml-4 text-3xl">{icon}</div>}
      </div>
    </div>
  );
}
