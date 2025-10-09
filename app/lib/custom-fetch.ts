type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type FetchParams = {
  API_URL: string;
  METHOD?: "GET" | "POST" | "PUT" | "DELETE";
  BODY?: unknown | FormData;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

export const CustomFetchData = async <T = unknown>({
  API_URL,
  METHOD = "GET",
  BODY,
}: FetchParams): Promise<ApiResponse<T>> => {
  try {
    const url = API_URL.startsWith("http") ? API_URL : `${BASE_URL}${API_URL}`;

    let headers: HeadersInit | undefined;
    let body: BodyInit | undefined;

    if (METHOD !== "GET" && BODY !== undefined && BODY !== null) {
      if (BODY instanceof FormData) {
        body = BODY;
      } else {
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify(BODY);
      }
    }

    const options: RequestInit = {
      cache: "no-store",
      method: METHOD,
      headers,
      body,
    };

    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");

    const isJson = contentType?.includes("application/json");
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
      return {
        success: false,
        error: data?.error || `HTTP error! Status: ${res.status}`,
      };
    }

    if (!isJson) {
      return {
        success: false,
        error: "Hatalı veri tipi. JSON bekleniyor.",
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    console.error("Fetch Error:", error);
    return {
      success: false,
      error: "Ağ bağlantı hatası veya beklenmeyen bir durum yaşandı.",
    };
  }
};
