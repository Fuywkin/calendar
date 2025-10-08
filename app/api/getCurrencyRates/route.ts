import { XMLParser } from "fast-xml-parser";
import { NextResponse } from "next/server";

// ÖRNEK FETCH
// http://localhost:3000/api/getCurrencyRates?id=EUR

const CURRENCY_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";

const CURRENCY_MAP: Record<string, number> = {
  USD: 0,
  AUD: 1,
  DKK: 2,
  EUR: 3,
  GBP: 4,
  CHF: 5,
  SEK: 6,
  CAD: 7,
  KWD: 8,
  NOK: 9,
  SAR: 10,
  JPY: 11,
  BGN: 12,
  RON: 13,
  RUB: 14,
  IRR: 15,
  CNY: 16,
  PKR: 17,
  QAR: 18,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Kur kodu belirtilmedi." },
      { status: 400 }
    );
  }

  const upperId = id.toUpperCase();
  const index = CURRENCY_MAP[upperId];

  if (index === undefined) {
    return NextResponse.json(
      { success: false, error: "Kur bulunamadı." },
      { status: 404 }
    );
  }

  try {
    const response = await fetch(CURRENCY_URL);
    const xmlText = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: true,
    });
    const jsonObj = parser.parse(xmlText);

    const currencies = jsonObj.Tarih_Date.Currency;
    const currencyNode = currencies[index];

    if (!currencyNode) {
      return NextResponse.json(
        { success: false, error: "Kur verisi bulunamadı." },
        { status: 404 }
      );
    }

    const name = currencyNode.CurrencyName;
    let buying: string | null = null;
    let selling: string | null = null;

    if (index > 11) {
      buying = currencyNode.ForexBuying ?? null;
      selling = currencyNode.ForexSelling ?? null;
    } else {
      buying = currencyNode.BanknoteBuying ?? null;
      selling = currencyNode.BanknoteSelling ?? null;
    }

    return NextResponse.json({
      success: true,
      data: {
        name,
        buying,
        selling,
      },
    });
  } catch (error) {
    console.error("GET /getCurrencyRates error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
