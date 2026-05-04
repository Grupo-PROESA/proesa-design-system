type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiClient {
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
  put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
  patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
  delete<T>(path: string, init?: RequestInit): Promise<T>;
  request<T>(method: Method, path: string, body?: unknown, init?: RequestInit): Promise<T>;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function apiClient(baseUrl: string): ApiClient {
  const request = async <T>(method: Method, path: string, body?: unknown, init: RequestInit = {}): Promise<T> => {
    const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
    const headers = new Headers(init.headers);
    if (body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (!headers.has("X-Requested-With")) {
      headers.set("X-Requested-With", "XMLHttpRequest");
    }

    const res = await fetch(url, {
      ...init,
      method,
      credentials: "include",
      headers,
      body: body !== undefined ? JSON.stringify(body) : init.body,
    });

    const text = await res.text();
    let parsed: unknown = text;
    if (text && headers.get("Content-Type")?.includes("json") || res.headers.get("Content-Type")?.includes("json")) {
      try {
        parsed = JSON.parse(text);
      } catch {
        // queda como text
      }
    }

    if (!res.ok) {
      const message = typeof parsed === "object" && parsed && "message" in parsed
        ? String((parsed as { message: unknown }).message)
        : `${res.status} ${res.statusText}`;
      throw new ApiError(res.status, parsed, message);
    }
    return parsed as T;
  };

  return {
    get: <T>(path: string, init?: RequestInit) => request<T>("GET", path, undefined, init),
    post: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>("POST", path, body, init),
    put: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>("PUT", path, body, init),
    patch: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>("PATCH", path, body, init),
    delete: <T>(path: string, init?: RequestInit) => request<T>("DELETE", path, undefined, init),
    request,
  };
}
