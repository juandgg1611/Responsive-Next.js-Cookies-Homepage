// hooks/useBCV.ts
// Llama al proxy /api/bcv en vez de directamente a dolarvzla.com
// Esto funciona tanto en localhost como en Netlify (sin CORS).

import { useEffect, useState } from "react";

interface BcvData {
  usd: number;
  eur: number;
  date: string;
}

const FALLBACK: BcvData = {
  usd: 36.85,
  eur: 40.1,
  date: new Date().toLocaleDateString("es-VE"),
};

export function useBCV() {
  const [data, setData] = useState<BcvData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBCV() {
      setLoading(true);
      setError(null);

      try {
        // Llama a tu propio route handler — sin CORS, funciona en produccion
        const res = await fetch("/api/bcv");

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        if (json.error) throw new Error(json.error);

        if (!cancelled) {
          setData({ usd: json.usd, eur: json.eur, date: json.date });
        }
      } catch (err) {
        console.error("[useBCV] error:", err);
        if (!cancelled) {
          setError("No se pudo cargar la tasa BCV");
          setData(FALLBACK);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBCV();

    // Actualizar cada 5 minutos
    const interval = setInterval(fetchBCV, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}
