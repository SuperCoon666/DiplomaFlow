/* базовый URL */
const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : {};
const nodeEnv =
  typeof process !== 'undefined' && process.env ? process.env : {};

const BASE_FULL =
  viteEnv.VITE_API_URL ||
  nodeEnv.VITE_API_URL ||
  'http://localhost:8080/api';

const BASE_PATH = new URL(BASE_FULL, location.origin).pathname.replace(/\/$/, '');

export async function request(
  path,
  { method = 'GET', body, headers = {}, retry401 = true } = {}
) {
  const token = document.cookie.match(/jwt=([^;]+)/)?.[1];

  const hdrs = {
    ...headers,
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const isJson = body && typeof body === 'object' && !(body instanceof FormData);
  if (isJson && !hdrs['Content-Type'])
    hdrs['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_PATH}${path}`, {
    method,
    headers: hdrs,
    credentials: 'include',
    body: isJson ? JSON.stringify(body) : body
  });

  if (res.status === 401 && retry401) {
    const ok = await refreshToken();
    if (ok) return request(path, { method, body, headers, retry401: false });
  }

  if (!res.ok) throw new Error((await safeText(res)) || `HTTP ${res.status}`);
  if (res.status === 204) return null;

  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}

async function refreshToken() {
  try {
    const r = await fetch(`${BASE_PATH}/auth/refresh`, { credentials: 'include' });
    return r.ok;
  } catch {
    return false;
  }
}

async function safeText(r) {
  try {
    return await r.text();
  } catch {
    return '';
  }
}
