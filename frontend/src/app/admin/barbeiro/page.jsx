"use client";

import AdminLayout from "../../../components/admin/AdminLayout";
import Barbeiros from "../../../components/admin/Barbeiros";

export default function Barbeiro() {





  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold">
        Adicionar barbeiros
      </h2>
      <Barbeiros />
    </AdminLayout>
  );
}
