// app/api/cart/route.ts
// Maneja operaciones de carrito para usuarios ANÓNIMOS via service role.
// Los usuarios autenticados operan directamente con el cliente de Supabase.

import { createAdminClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
  const body = await req.json();
  const { product_id, name, price, image, badge, max_quantity = 10 } = body;

  if (!product_id || !name || price == null) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  let sessionId = getSessionId(req);
  const isNew = !sessionId;
  if (isNew) sessionId = uuidv4();

  const supabase = createAdminClient();

  // Obtener o crear carrito
  let cartId: string;

  const { data: existingCart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .is("user_id", null)
    .maybeSingle();

  if (existingCart) {
    cartId = existingCart.id;
  } else {
    const { data: newCart, error } = await supabase
      .from("carts")
      .insert({ session_id: sessionId })
      .select("id")
      .single();

    if (error || !newCart) {
      return NextResponse.json({ error: "No se pudo crear el carrito" }, { status: 500 });
    }
    cartId = newCart.id;
  }

  // Verificar si el item ya existe
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", product_id)
    .maybeSingle();

  if (existingItem) {
    // Sumar cantidad
    const newQty = Math.min(existingItem.quantity + 1, max_quantity);
    await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", existingItem.id);
  } else {
    // Insertar nuevo item
    await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id,
      name,
      price,
      image,
      badge,
      quantity: 1,
      max_quantity,
    });
  }

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
