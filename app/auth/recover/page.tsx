// src/app/auth/recovery/page.tsx
import { PasswordRecoveryFlow } from "@/app/auth/recover/PasswordRecoveryFlow";

export const metadata = {
  title: "Recuperar Contraseña - Vian Cookies",
  description: "Recupera el acceso a tu cuenta de Vian Cookies",
};

export default function RecoveryPage() {
  return <PasswordRecoveryFlow />;
}
