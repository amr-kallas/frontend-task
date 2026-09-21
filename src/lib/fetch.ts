export const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/+$/, "");

/** A hanging upstream would otherwise hang the render itself. */
const DEFAULT_TIMEOUT_MS = 8_000;

/**
 * Applied to every request. Auth tokens belong here once the API needs them —
 * one place instead of one per call site.
 */
function defaultHeaders(): HeadersInit {
  return { Accept: "application/json" };
}

/* -------------------------------------------------------------------------- */
/*  Errors                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Every failure leaves this module as an ApiError, so `error.tsx` and any
 * caller always get the same shape no matter what went wrong.
 * `status === 0` means the request never reached the server (network/timeout).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly method: string;
  readonly url: string;
  /** Upstream response body, when it sent a readable one. */
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

  /** Network failures and 5xx are worth retrying; a 400 is not. */
  get isRetryable(): boolean {
    return this.status === 0 || this.status >= 500;
  }
}

/**
 * Single funnel for failed requests. Swap the console for a real reporter
 * (Sentry, logflare, ...) and the whole app is covered.
 */
function reportError(error: ApiError): void {
  console.error(
    `[http] ${error.method} ${error.url} -> ${error.status || "network"}: ${error.message}`,
  );
}

/* -------------------------------------------------------------------------- */
/*  Cache policy                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Modelled as a union on purpose: `no-store` and `revalidate` are mutually
 * exclusive in Next's fetch API, and setting both on one request silently
 * breaks caching. Separate variants let the compiler reject that mistake.
 */
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

/* -------------------------------------------------------------------------- */
/*  URL building                                                              */
/* -------------------------------------------------------------------------- */

type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue | QueryValue[]>;

/**
 * Joined by hand rather than with `new URL(path, base)`, which would drop a
 * path prefix on a base like `https://host/api/v1`.
 */
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

/* -------------------------------------------------------------------------- */
/*  Core request                                                              */
/* -------------------------------------------------------------------------- */

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

  if (res.status === 204) return undefined as T;

  try {
    return (await res.json()) as T;
  } catch {
    return fail("Server returned a malformed JSON body", res.status);
  }
}

/* -------------------------------------------------------------------------- */
/*  Public client                                                             */
/* -------------------------------------------------------------------------- */

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
