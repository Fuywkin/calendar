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
}

export {};
