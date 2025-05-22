export function setupMockServer() {
  if (!import.meta.env.DEV) return;

  const originalFetch = window.fetch;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* версии по типу практики */
  window._versions ||= { project: [], tech: [], pre: [] };

  window.fetch = async (url, options = {}) => {
    const path = url.toString().replace(/^https?:\/\/[^/]+/, '');

    /* ---------- логин ---------- */
    if (path === '/api/auth/login' && options.method === 'POST') {
      await sleep(400);
      const { email } = JSON.parse(await options.body.text());
      const role = email?.includes('teacher')
        ? 'teacher'
        : email?.includes('admin')
        ? 'admin'
        : 'student';
      const token = `mock.${role}.token`;
      document.cookie = `jwt=${token}; path=/; samesite=lax`;
      return new Response(JSON.stringify({ token, user: { email, role } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    /* ---------- refresh ---------- */
    if (path === '/api/auth/refresh') {
      await sleep(150);
      return new Response(null, { status: 204 });
    }

    /* ---------- /practice/{type}/versions ---------- */
    const m = path.match(/^\/api\/practice\/(project|tech|pre)\/versions$/);
    if (m) {
      const type = m[1];

      // GET
      if (!options.method || options.method === 'GET') {
        return new Response(JSON.stringify(window._versions[type]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // POST
      if (options.method === 'POST') {
        const { content } = JSON.parse(await options.body.text());
        const version = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          content
        };
        window._versions[type].unshift(version);
        return new Response(JSON.stringify(version), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    /* fallback */
    return originalFetch(url, options);
  };
}
