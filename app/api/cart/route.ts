// app/api/bcv/route.ts
import { NextResponse } from "next/server";

const API_KEY =
  "a37f147c890a759b23ab7e7f3c3ea9b4d2c07e8fcb7572416ebafb24f552018f";
const API_URL = "https://api.dolarvzla.com/public/exchange-rate";

// Cache en memoria del servidor — se resetea al redeploy pero evita
// saturar la API en cada render. En Netlify las funciones son stateless
// asi que el cache dura lo que dure la instancia (minutos/horas).
let cache: {
  usd: number;
  eur: number;
  date: string;
  fetchedAt: number;
} | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export async function GET() {
  // Devolver cache si es reciente
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return NextResponse.json(
      { usd: cache.usd, eur: cache.eur, date: cache.date, cached: true },
      {
        headers: {
          // Cache en el CDN de Netlify por 5 minutos
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      },
    );
  }

  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "x-dolarvzla-key": API_KEY,
        "Content-Type": "application/json",
      },
      // Next.js cache: revalidar cada 5 minutos en el servidor
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`dolarvzla responded ${res.status}`);
    }

    const data = await res.json();

    if (!data.current) {
      throw new Error("Formato de respuesta inesperado");
    }

    const usd = Number(data.current.usd);
    const eur = Number(data.current.eur);

    if (isNaN(usd) || isNaN(eur)) {
      throw new Error("Tasas invalidas");
    }

    const date = new Date(data.current.date).toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    cache = { usd, eur, date, fetchedAt: Date.now() };

    return NextResponse.json(
      { usd, eur, date, cached: false },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      },
    );
  } catch (err) {
    console.error("[BCV] fetch error:", err);

    // Si hay cache vieja, usarla como fallback
    if (cache) {
      return NextResponse.json(
        {
          usd: cache.usd,
          eur: cache.eur,
          date: cache.date,
          cached: true,
          stale: true,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: "No se pudo obtener la tasa BCV" },
      { status: 503 },
    );
  }
}
