export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const path = endpoint.replace(/^\/+/, "");

  const response = await fetch(`${baseUrl}/${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
