const BASE_URL = (process.env.LABELGRID_API_BASE_URL || "https://api.labelgrid.com/api/public").replace(/\/$/, "");

export function labelGridConfigured() {
  return Boolean(process.env.LABELGRID_API_TOKEN);
}

export async function labelGridRequest(path: string, init: RequestInit = {}) {
  const token = process.env.LABELGRID_API_TOKEN;
  if (!token) throw new Error("LABELGRID_API_TOKEN is not configured");

  const response = await fetch(BASE_URL + path, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
      ...(init.body ? {"Content-Type": "application/json"} : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const text = await response.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = {raw: text}; }

  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data
      ? String((data as {message?: unknown}).message)
      : "LabelGrid API request failed";
    throw new Error(message + " (HTTP " + response.status + ")");
  }

  return data;
}

export async function getLabelGridStatus() {
  if (!labelGridConfigured()) {
    return {configured: false, connected: false, message: "Distribution provider is not connected yet."};
  }

  try {
    await labelGridRequest("/me");
    return {configured: true, connected: true, message: "LabelGrid connection is working."};
  } catch (error) {
    return {
      configured: true,
      connected: false,
      message: error instanceof Error ? error.message : "Unable to verify LabelGrid connection.",
    };
  }
}
