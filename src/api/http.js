/**
 * Универсальный базовый адрес:
 * ─ сначала берём значение, подставленное Vite (import.meta.env),
 * ─ затем (если код выполняется в Node) читаем переменную окружения process.env,
 * ─ иначе используем локальный дефолт.
 */
const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : {};
const nodeEnv =
  typeof process !== 'undefined' && process.env ? process.env : {};

const BASE =
  viteEnv.VITE_API_URL ||
  nodeEnv.VITE_API_URL ||
  'http://localhost:8080/api';

/**
 * Обёртка над fetch.
 *
 * @param {string}  path               относительный путь, напр. '/auth/login'
 * @param {object}  [options]
 * @param {string}  [options.method]   HTTP-метод, по умолчанию 'GET'
 * @param {object}  [options.body]     тело запроса (при object авто-JSON)
 * @param {object}  [options.headers]  дополнительные заголовки
 * @param {boolean} [options.retry401] повторить ли вызов после refresh
 */
export async function request(
  path,
  { method = 'GET', body, headers = {}, retry401 = true } = {}
) {
  const token = document.cookie.match(/jwt=([^;]+)/)?.[1];

  // формируем заголовки
  const hdrs = {
    ...headers,
    ...(token && { Authorization: `Bearer ${token}` })
  };

  // если отправляем JSON-объект — ставим Content-Type
  const isJsonBody =
    body && typeof body === 'object' && !(body instanceof FormData);
  if (isJsonBody && !hdrs['Content-Type']) {
    hdrs['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: hdrs,
    credentials: 'include',
    body: isJsonBody ? JSON.stringify(body) : body
  });

  // автоматическое продление сессии
  if (res.status === 401 && retry401) {
    const ok = await refreshToken();
    if (ok) {
      return request(path, { method, body, headers, retry401: false });
    }
  }

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return null;

  // пробуем JSON, иначе текст
  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}

/** Запрашивает новый JWT-токен; true, если успешно */
async function refreshToken() {
  try {
    const r = await fetch(`${BASE}/auth/refresh`, { credentials: 'include' });
    return r.ok;
  } catch {
    return false;
  }
}

/** Безопасно читаем текст ответа без выброса исключения */
async function safeText(response) {
  try {
    return await response.text();
  } catch {
    return '';
  }
}
