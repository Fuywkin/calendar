declare global {
  interface PUBLIC_HOLIDAY_PROPS {
    title: string;
    date: number;
    localeDateString: string;
  }

  interface CURRENCY_RATES_PROPS {
    name: string;
    buying: string;
    selling: string;
  }

  interface SCHOOL_DATES_PROPS {
    id: string;
    baslangic: string;
    bitis: string;
    aciklama: string;
  }
}

export {};
