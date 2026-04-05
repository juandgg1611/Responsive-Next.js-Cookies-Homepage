// app/api/cart/merge/route.ts
// Fusiona el carrito anónimo (cookie httpOnly) con el carrito del usuario autenticado.
// Se llama desde el cliente al hacer SIGNED_IN — el servidor puede leer la cookie httpOnly.

export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "nyc_session_id";

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value;
  const body = await req.json();
  const { user_id } = body;

  if (!sessionId || !user_id) {
    return NextResponse.json({ success: false, reason: "missing params" });
  }

  const supabase = createAdminClient();

  const { error } = await supabase.rpc("merge_anonymous_cart", {
    p_session_id: sessionId,
    p_user_id: user_id,
  });

  if (error) {
    console.error("[cart/merge] RPC error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
