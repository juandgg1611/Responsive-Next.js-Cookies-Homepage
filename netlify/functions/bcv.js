// netlify/functions/bcv.js
// Netlify Function nativa — mas confiable que Next.js API routes en Netlify
// Se accede en: /.netlify/functions/bcv
// Con el redirect en netlify.toml, se mapea a: /api/bcv

const API_KEY =
  "a37f147c890a759b23ab7e7f3c3ea9b4d2c07e8fcb7572416ebafb24f552018f";
const API_URL = "https://api.dolarvzla.com/public/exchange-rate";
const FALLBACK = { usd: 459.45, eur: 500.0 };

exports.handler = async function () {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "x-dolarvzla-key": API_KEY,
        "Content-Type": "application/json",
      },
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ usd, eur, date }),
    };
  } catch (err) {
    console.error("[BCV Function] error:", err.message);

    const date = new Date().toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Siempre devolver 200 con fallback — nunca rompemos la UI
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        usd: FALLBACK.usd,
        eur: FALLBACK.eur,
        date,
        fallback: true,
      }),
    };
  }
};
