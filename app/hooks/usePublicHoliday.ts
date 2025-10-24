import { useCallback, useState } from "react";
import { CustomFetchData } from "../lib/custom-fetch";

export function usePublicHolidayData<T>() {
  const [holiday, setHoliday] = useState<T[]>([]);

  const getHolidayData = useCallback(async () => {
    try {
      const url = "/api/getPublicHoliday";

      const res = await CustomFetchData<T[]>({ API_URL: url });

      if (!res.data || !res.success) {
        console.error("Tatil API hatası:", res.error);
        setHoliday([]);
        return;
      }

      setHoliday(res.data);
    } catch (error) {
      console.error("Tatil verisi alınamadı:", error);
      setHoliday([]);
    }
  }, []);

  const getNextHoliday = (holidays: PUBLIC_HOLIDAY_PROPS[]) => {
    const today = new Date().getTime();

    const futureHolidays = holidays.filter((h) => h.date > today);

    if (futureHolidays.length === 0) return null;

    const nextHoliday = futureHolidays.reduce((prev, curr) =>
      curr.date < prev.date ? curr : prev
    );

    const daysLeft = Math.ceil(
      (nextHoliday.date - today) / (1000 * 60 * 60 * 24)
    );

    return { nextHoliday, daysLeft };
  };

  return {
    holiday,
    getHolidayData,
    getNextHoliday,
  };
}
