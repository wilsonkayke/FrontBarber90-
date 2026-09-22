"use client";

import React, { createContext, useContext, useState } from "react";

const AgendaContext = createContext(undefined);

export default function AgendaLayout({ children, nomeUser, exit }) {
  const [currentAction, setCurrentAction] = useState(null);

  return (
    <AgendaContext.Provider
      value={{
        nomeUser,
        currentAction,
        setCurrentAction,
        exit,
      }}
    >
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  const context = useContext(AgendaContext);

  if (!context) {
    return {
      nomeUser: "",
      currentAction: null,
      setCurrentAction: () => {},
      exit: () => {},
    };
  }

  return context;
}