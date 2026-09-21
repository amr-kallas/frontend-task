export const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/+$/, "");

const DEFAULT_TIMEOUT_MS = 8_000;

function defaultHeaders(): HeadersInit {
  return { Accept: "application/json" };
}

export class ApiError extends Error {
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly details?: string;

  constructor(init: {
    message: string;
    status: number;
    method: string;
    url: string;
    details?: string;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.status = init.status;
    this.method = init.method;
    this.url = init.url;
    this.details = init.details;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isUnauthorized(): boolean {
    return this.status === 401 || this.status === 403;
  }

  get isRetryable(): boolean {
    return this.status === 0 || this.status >= 500;
  }
}

function reportError(error: ApiError): void {
  console.error(
    `[http] ${error.method} ${error.url} -> ${error.status || "network"}: ${error.message}`,
  );
}


export type CachePolicy =
  | { mode: "no-store" }
  | { mode: "revalidate"; seconds: number; tags?: string[] }
  | { mode: "force-cache"; tags?: string[] };

export const DEFAULT_CACHE: CachePolicy = { mode: "no-store" };

function cacheInit(policy: CachePolicy): RequestInit {
  switch (policy.mode) {
    case "no-store":
      return { cache: "no-store" };
    case "revalidate":
      return { next: { revalidate: policy.seconds, tags: policy.tags } };
    case "force-cache":
      return { cache: "force-cache", next: { tags: policy.tags } };
  }
}


type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue | QueryValue[]>;


function buildUrl(path: string, query?: Query): string {
  const url = `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item === undefined || item === null) continue;
      params.append(key, String(item));
    }
  }

  const search = params.toString();
  return search ? `${url}?${search}` : url;
}


export interface RequestOptions {
  query?: Query;
  cache?: CachePolicy;
  timeoutMs?: number;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const {
    query,
    cache = DEFAULT_CACHE,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    headers,
  } = options;

  const url = buildUrl(path, query);
  const hasBody = body !== undefined;

  const fail = (message: string, status: number, details?: string): never => {
    const error = new ApiError({ message, status, method, url, details });
    reportError(error);
    throw error;
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      ...cacheInit(cache),
      headers: {
        ...defaultHeaders(),
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: hasBody ? JSON.stringify(body) : undefined,
      signal: options.signal ?? AbortSignal.timeout(timeoutMs),
    });
  } catch (cause) {
    const timedOut = cause instanceof Error && cause.name === "TimeoutError";
    return fail(
      timedOut
        ? `Request timed out after ${timeoutMs}ms`
        : "Could not reach the server",
      0,
      cause instanceof Error ? cause.message : undefined,
    );
  }

  if (!res.ok) {
    const details = await res.text().catch(() => undefined);
    return fail(
      `Server responded with ${res.status}`,
      res.status,
      details || undefined,
    );
  }

  let text: string;
  try {
    text = await res.text();
  } catch {
    return fail("Could not read the response body", res.status);
  }

  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return fail("Server returned a malformed JSON body", res.status);
  }
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
