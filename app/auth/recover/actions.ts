"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function updateUserPassword(
  email: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();

    // Buscar el usuario por email usando la Admin API
    const {
      data: { users },
      error: listError,
    } = await supabase.auth.admin.listUsers();

    if (listError) throw listError;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return {
        success: false,
        error: "No se encontró una cuenta con ese correo.",
      };
    }

    // Actualizar la contraseña usando admin
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword },
    );

    if (updateError) throw updateError;

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message ?? "Error al actualizar la contraseña.",
    };
  }
}
