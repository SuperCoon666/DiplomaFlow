/* Dev-mock для API. Подключается только при import.meta.env.DEV */

export function setupMockServer() {
  if (!import.meta.env.DEV) return;          // в проде не мешаемся

  const nativeFetch = window.fetch;
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  /* Хранилище версий: отдельно для каждой практики */
  window._versions ||= { project: [], tech: [], pre: [] };

  /* --------─ Вспомогательное чтение тела запроса -------- */
  async function readBody(body) {
    if (!body) return {};
    if (typeof body === 'string')           return JSON.parse(body || '{}');
    if (body instanceof Blob)              return JSON.parse(await body.text());
    if (typeof body.text === 'function')   return JSON.parse(await body.text());
    return {};
  }

  /* --------─ Переопределяем fetch -------- */
  window.fetch = async (url, options = {}) => {
    const path = url.toString().replace(/^https?:\/\/[^/]+/, '');

    /* === AUTH /login === */
    if (path === '/api/auth/login' && options.method === 'POST') {
      await wait(400);
      const { email } = await readBody(options.body);
      const role = email?.includes('teacher')
        ? 'teacher'
        : email?.includes('admin')
        ? 'admin'
        : 'student';
      const token = `mock.${role}.token`;
      document.cookie = `jwt=${token}; path=/; samesite=lax`;
      return new Response(
        JSON.stringify({ token, user: { email, role } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /* === AUTH /refresh === */
    if (path === '/api/auth/refresh') {
      await wait(150);
      return new Response(null, { status: 204 });
    }

    /* === PRACTICE versions === */
    const m = path.match(/^\/api\/practice\/(project|tech|pre)\/versions$/);
    if (m) {
      const type = m[1];

      /* GET — список версий */
      if (!options.method || options.method === 'GET') {
        return new Response(
          JSON.stringify(window._versions[type]),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      /* POST — сохранить новую */
      if (options.method === 'POST') {
        const { content } = await readBody(options.body);
        const version = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          content
        };
        window._versions[type].unshift(version);
        return new Response(
          JSON.stringify(version),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    /* --- всё остальное отдаём оригинальному fetch --- */
    return nativeFetch(url, options);
  };
}
