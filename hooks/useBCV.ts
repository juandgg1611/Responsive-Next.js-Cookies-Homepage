// hooks/useBCV.ts
import { useEffect, useState } from "react";

interface BcvData {
  usd: number;
  eur: number;
  date: string;
}

// Fallback por si el proxy tambien falla
const FALLBACK: BcvData = {
  usd: 459.45,
  eur: 500.0,
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
        const res = await fetch("/api/bcv", { cache: "no-store" });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

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
    const interval = setInterval(fetchBCV, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}
