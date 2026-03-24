// app/api/bcv/route.ts
import { NextResponse } from "next/server";

const API_KEY =
  "a37f147c890a759b23ab7e7f3c3ea9b4d2c07e8fcb7572416ebafb24f552018f";
const API_URL = "https://api.dolarvzla.com/public/exchange-rate";

// Fallback hardcodeado — se usa si la API falla
const FALLBACK = { usd: 459.45, eur: 500.0 };

let cache: {
  usd: number;
  eur: number;
  date: string;
  fetchedAt: number;
} | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export const dynamic = "force-dynamic"; // Netlify: no pre-render esta ruta

export async function GET() {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return NextResponse.json({
      usd: cache.usd,
      eur: cache.eur,
      date: cache.date,
    });
  }

  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "x-dolarvzla-key": API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.current) throw new Error("Formato inesperado");

    const usd = Number(data.current.usd);
    const eur = Number(data.current.eur);
    if (isNaN(usd) || isNaN(eur)) throw new Error("Tasas invalidas");

    const date = new Date(data.current.date).toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    cache = { usd, eur, date, fetchedAt: Date.now() };
    return NextResponse.json({ usd, eur, date });
  } catch (err) {
    console.error("[BCV] error:", err);

    // Devolver fallback — nunca 503, siempre algo util
    const date = new Date().toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return NextResponse.json({
      usd: FALLBACK.usd,
      eur: FALLBACK.eur,
      date,
      fallback: true,
    });
  }
}
