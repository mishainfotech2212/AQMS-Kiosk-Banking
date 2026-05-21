import { getApiBaseUrl, getSupabaseAnonKey } from '@/services/api/config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = RequestInit & {
  json?: unknown;
  searchParams?: Record<string, string | undefined>;
};

function withQuery(path: string, params?: Record<string, string | undefined>): string {
  if (!params) return path;
  const q: string[] = [];
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') q.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  });
  if (q.length === 0) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}${q.join('&')}`;
}

function buildDefaultHeaders(): Headers {
  const headers = new Headers();
  const key = getSupabaseAnonKey();
  if (key) {
    headers.set('Authorization', `Bearer ${key}`);
    headers.set('apikey', key);
  }
  return headers;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const base = getApiBaseUrl();
  const { json, searchParams, headers: hdr, ...init } = options;
  const pathWithQuery = withQuery(path.startsWith('/') ? path : `/${path}`, searchParams);
  const url = `${base}${pathWithQuery}`;

  const headers = buildDefaultHeaders();
  if (hdr) {
    new Headers(hdr as HeadersInit).forEach((value, key) => headers.set(key, value));
  }
  if (json !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[api]', init.method ?? 'GET', pathWithQuery);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : res.statusText || `HTTP ${res.status}`;
    throw new ApiError(msg, res.status, data);
  }

  return data as T;
}
