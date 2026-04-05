// app/api/cart/route.ts
// Maneja operaciones de carrito para usuarios ANÓNIMOS via service role.
// Los usuarios autenticados operan directamente con el cliente de Supabase.

import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic"; // Netlify: no pre-render esta ruta

const SESSION_COOKIE = "nyc_session_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

// ── Helper: obtener o crear session_id desde cookie HttpOnly ──
function getSessionId(req: NextRequest): string {
  return req.cookies.get(SESSION_COOKIE)?.value ?? "";
}

function setSessionCookie(res: NextResponse, sessionId: string) {
  res.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

// ── GET /api/cart — cargar carrito anónimo ────────────────────
export async function GET(req: NextRequest) {
  const sessionId = getSessionId(req);

  if (!sessionId) {
    // Primera visita: devolver carrito vacío, la cookie se crea en el primer POST
    return NextResponse.json({ cartId: null, items: [] });
  }

  const supabase = createAdminClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .is("user_id", null)
    .maybeSingle();

  if (!cart) {
    return NextResponse.json({ cartId: null, items: [] });
  }

  const { data: items } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .order("created_at");

  return NextResponse.json({ cartId: cart.id, items: items ?? [] });
}

// ── POST /api/cart/item — añadir o actualizar item ────────────
export async function POST(req: NextRequest) {
  console.log("[cart POST] Iniciando handler");

  // Verificar variables de entorno críticas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("[cart POST] NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓ presente" : "✗ FALTA");
  console.log("[cart POST] SUPABASE_SERVICE_ROLE_KEY:", serviceRoleKey ? "✓ presente" : "✗ FALTA");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[cart POST] ERROR: Variables de entorno de Supabase no configuradas");
    return NextResponse.json(
      { error: "Configuración del servidor incompleta", missing: { url: !supabaseUrl, key: !serviceRoleKey } },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
    console.log("[cart POST] Body recibido:", JSON.stringify(body));
  } catch (e) {
    console.error("[cart POST] ERROR al parsear body:", e);
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { product_id, name, price, image, badge, max_quantity = 10 } = body as Record<string, unknown>;

  if (!product_id || !name || price == null) {
    console.warn("[cart POST] Faltan campos requeridos:", { product_id, name, price });
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  let sessionId = getSessionId(req);
  const isNew = !sessionId;
  if (isNew) sessionId = uuidv4();
  console.log("[cart POST] sessionId:", sessionId, "| isNew:", isNew);

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
    console.log("[cart POST] Cliente Supabase admin creado");
  } catch (e) {
    console.error("[cart POST] ERROR al crear cliente Supabase:", e);
    return NextResponse.json({ error: "Error al conectar con la base de datos" }, { status: 500 });
  }

  // Obtener o crear carrito
  let cartId: string;

  console.log("[cart POST] Buscando carrito existente para session_id:", sessionId);
  const { data: existingCart, error: cartFetchError } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .is("user_id", null)
    .maybeSingle();

  if (cartFetchError) {
    console.error("[cart POST] ERROR al buscar carrito:", cartFetchError);
    return NextResponse.json({ error: "Error al buscar carrito", detail: cartFetchError.message }, { status: 500 });
  }

  if (existingCart) {
    cartId = existingCart.id;
    console.log("[cart POST] Carrito existente encontrado:", cartId);
  } else {
    console.log("[cart POST] Creando nuevo carrito...");
    const { data: newCart, error } = await supabase
      .from("carts")
      .insert({ session_id: sessionId })
      .select("id")
      .single();

    if (error || !newCart) {
      console.error("[cart POST] ERROR al crear carrito:", error);
      return NextResponse.json({ error: "No se pudo crear el carrito", detail: error?.message }, { status: 500 });
    }
    cartId = newCart.id;
    console.log("[cart POST] Nuevo carrito creado:", cartId);
  }

  // Verificar si el item ya existe
  console.log("[cart POST] Buscando item existente product_id:", product_id);
  const { data: existingItem, error: itemFetchError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", product_id)
    .maybeSingle();

  if (itemFetchError) {
    console.error("[cart POST] ERROR al buscar item:", itemFetchError);
    return NextResponse.json({ error: "Error al buscar item", detail: itemFetchError.message }, { status: 500 });
  }

  if (existingItem) {
    // Sumar cantidad
    const newQty = Math.min(existingItem.quantity + 1, max_quantity as number);
    console.log("[cart POST] Actualizando cantidad del item:", existingItem.id, "-> qty:", newQty);
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", existingItem.id);
    if (updateError) {
      console.error("[cart POST] ERROR al actualizar item:", updateError);
      return NextResponse.json({ error: "Error al actualizar item", detail: updateError.message }, { status: 500 });
    }
  } else {
    // Insertar nuevo item
    console.log("[cart POST] Insertando nuevo item en carrito:", cartId);
    const { error: insertError } = await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id,
      name,
      price,
      image,
      badge,
      quantity: 1,
      max_quantity,
    });
    if (insertError) {
      console.error("[cart POST] ERROR al insertar item:", insertError);
      return NextResponse.json({ error: "Error al insertar item", detail: insertError.message }, { status: 500 });
    }
  }

  console.log("[cart POST] Operación completada con éxito");
  const res = NextResponse.json({ success: true, cartId });
  if (isNew) setSessionCookie(res, sessionId);
  return res;
}

// ── PATCH /api/cart/item — actualizar cantidad ────────────────
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { product_id, quantity } = body;
  const sessionId = getSessionId(req);

  if (!sessionId || !product_id || quantity == null) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .is("user_id", null)
    .maybeSingle();

  if (!cart) return NextResponse.json({ error: "Carrito no encontrado" }, { status: 404 });

  if (quantity <= 0) {
    await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id)
      .eq("product_id", product_id);
  } else {
    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("cart_id", cart.id)
      .eq("product_id", product_id);
  }

  return NextResponse.json({ success: true });
}

// ── DELETE /api/cart — vaciar carrito ─────────────────────────
export async function DELETE(req: NextRequest) {
  const sessionId = getSessionId(req);
  if (!sessionId) return NextResponse.json({ success: true });

  const supabase = createAdminClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .is("user_id", null)
    .maybeSingle();

  if (cart) {
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
  }

  return NextResponse.json({ success: true });
}
