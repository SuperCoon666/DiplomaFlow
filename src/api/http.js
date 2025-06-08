/* src/api/http.js – универсальный helper ------------------------------------------------ */

const DEV   =  import.meta.env.DEV;
const BASE  = DEV                 // в dev-режиме работаем через mock
  ? '/api'
  : (import.meta.env.VITE_API_URL ?? '/api');

/* ----------------------------------- */

export async function request(
  path,
  { method = 'GET', body, headers = {}, retry401 = true } = {}
) {
  const token = document.cookie.match(/jwt=([^;]+)/)?.[1];

  /* базовые заголовки */
  const hdrs = { ...headers, ...(token && { Authorization: `Bearer ${token}` }) };

  /* JSON body → Content-Type */
  const isJson = body && typeof body === 'object' && !(body instanceof FormData);
  if (isJson && !hdrs['Content-Type']) hdrs['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: hdrs,
    credentials: 'include',
    body: isJson ? JSON.stringify(body) : body
  });

  /* автоматическое продление сессии */
  if (res.status === 401 && retry401) {
    const ok = await refreshToken();
    if (ok) return request(path, { method, body, headers, retry401: false });
  }

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;          // No Content
  try {
    const data = await res.json();
    return (typeof data === 'object' && data !== null) ? data : {};
  } catch (_) {
    return {};
  }
}

async function refreshToken() {
  try { const r = await fetch(`${BASE}/auth/refresh`, { credentials: 'include' });
        return r.ok; } catch { return false; }
}

const safeText = r => r.text().catch(() => '');
