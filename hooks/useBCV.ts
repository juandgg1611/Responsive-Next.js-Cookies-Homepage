// hooks/useBCV.ts
import { useEffect, useState } from "react";

interface BcvData {
  usd: number;
  eur: number;
  date: string;
}

const API_KEY =
  "a37f147c890a759b23ab7e7f3c3ea9b4d2c07e8fcb7572416ebafb24f552018f";
const API_URL = "https://api.dolarvzla.com/public/exchange-rate";

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
    async function fetchBCV() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "x-dolarvzla-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const result = await response.json();

        if (!result.current) throw new Error("Formato de respuesta inválido");

        const usd = result.current.usd;
        const eur = result.current.eur;

        if (isNaN(usd) || isNaN(eur)) throw new Error("Tasas inválidas");

        setData({
          usd,
          eur,
          date: new Date(result.current.date).toLocaleDateString("es-VE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        });
      } catch (err) {
        console.error("Error obteniendo tasa BCV:", err);
        setError("No se pudo cargar la tasa BCV");
        setData(FALLBACK);
      } finally {
        setLoading(false);
      }
    }

    fetchBCV();
    const interval = setInterval(fetchBCV, 300000); // cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
