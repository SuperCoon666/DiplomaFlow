/* Dev-mock для API. Подключается только при import.meta.env.DEV */

export function setupMockServer() {
  if (!import.meta.env.DEV) return;          // в production – выходим

  const nativeFetch = window.fetch;
  const wait  = ms => new Promise(r => setTimeout(r, ms));

  /* памяти хватает — храним версии просто в RAM */
  window._versions ||= { project: [], tech: [], pre: [] };

  async function read(body) {
    if (!body) return {};
    if (typeof body === 'string')            return JSON.parse(body || '{}');
    if (body instanceof Blob)               return JSON.parse(await body.text());
    if (typeof body.text === 'function')    return JSON.parse(await body.text());
    return {};
  }

  /* ------------ patch fetch ------------ */
  window.fetch = async (url, opts = {}) => {
    const path = url.toString().replace(/^https?:\/\/[^/]+/, '');

    /* ---------- AUTH ---------- */
    if (path === '/api/auth/login' && opts.method === 'POST') {
      await wait(400);
      const { email } = await read(opts.body);
      const role  = email?.includes('teacher')
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

    if (path === '/api/auth/refresh') {
      await wait(150);
      return new Response(null, { status: 204 });
    }

    /* ---------- PRACTICE ---------- */
    const m = path.match(/^\/api\/practice\/(project|tech|pre)\/versions$/);
    if (m) {
      const type = m[1];

      /* GET */
      if (!opts.method || opts.method === 'GET') {
        return new Response(
          JSON.stringify(window._versions[type]),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      /* POST */
      if (opts.method === 'POST') {
        const { content } = await read(opts.body);
        const version = {
          id:   Date.now(),
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

    /* всё остальное — обычный fetch */
    return nativeFetch(url, opts);
  };
}
