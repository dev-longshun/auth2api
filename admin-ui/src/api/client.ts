const API_KEY_STORAGE_KEY = "auth2api_admin_key";

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const key = getApiKey();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (key) {
    headers["Authorization"] = `Bearer ${key}`;
  }

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    clearApiKey();
    window.location.reload();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text || res.statusText}`);
  }

  return res.json() as Promise<T>;
}
