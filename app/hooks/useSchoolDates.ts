import { useCallback, useState } from "react";
import { SchoolCloseDate } from "../constants/school-dates";

export function useSchoolDates() {
  const [schoolDate, setSchoolDate] = useState<SCHOOL_DATES_PROPS[]>([]);

  const getSchoolDateData = useCallback(async () => {
    try {
      const data = SchoolCloseDate.map((item) => ({
        id: item.id,
        baslangic: item.baslangic,
        bitis: item.bitis,
        aciklama: item.aciklama,
      }));

      if (!data || data.length === 0) {
        console.error("Okul Tatil verisi alınamadı.");
        setSchoolDate([]);
        return;
      }

      setSchoolDate(data);
    } catch (error) {
      console.error("Okul Tatil verisi alınamadı:", error);
      setSchoolDate([]);
    }
  }, []);

  const getNextSchoolDate = (schoolDates: SCHOOL_DATES_PROPS[]) => {
    const today = new Date().getTime();

    const futureSchoolDates = schoolDates.filter(
      (h) => new Date(h.baslangic).getTime() > today
    );

    if (futureSchoolDates.length === 0) return null;

    const nextSchoolDate = futureSchoolDates.reduce((prev, curr) =>
      new Date(curr.baslangic).getTime() < new Date(prev.baslangic).getTime()
        ? curr
        : prev
    );

    const daysLeft = Math.ceil(
      (new Date(nextSchoolDate.baslangic).getTime() - today) /
        (1000 * 60 * 60 * 24)
    );

    return { nextSchoolDate, daysLeft };
  };

  return {
    schoolDate,
    getSchoolDateData,
    getNextSchoolDate,
  };
}
