"use client";

import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {   
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}