import { useCallback, useState } from "react";
import { CustomFetchData } from "../lib/custom-fetch";

// EXAMPLE
// useCurrencyData<CURRENCY_RATES_PROPS>({ queryType: "USD"})

export function useCurrencyData<T>({ queryType }: { queryType: string }) {
  const [currency, setCurrency] = useState<T[]>([]);

  const getCurrencyData = useCallback(async () => {
    try {
      const url = `/api/getCurrencyRates?id=${queryType}`;

      const res = await CustomFetchData<T[]>({ API_URL: url });

      if (!res.data || !res.success) {
        console.error("Kur API hatası:", res.error);
        setCurrency([]);
        return;
      }

      setCurrency(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      console.error("Kur verisi alınamadı:", error);
      setCurrency([]);
    }
  }, [queryType]);

  return {
    currency,
    getCurrencyData,
  };
}
