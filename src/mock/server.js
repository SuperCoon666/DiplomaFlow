export function setupMockServer() {
  if (!import.meta.env.DEV) return; // только dev

  const originalFetch = window.fetch;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  window.fetch = async (url, options = {}) => {
    const path = url.toString().replace(/^https?:\/\/[^/]+/, '');

    /* ---------- ЛОГИН ---------- */
    if (path === '/api/auth/login' && options.method === 'POST') {
      await sleep(800);

      // читаем тело запроса
      const bodyText = options.body ? await options.body.text?.() : '';
      const { email } = bodyText ? JSON.parse(bodyText) : {};

      // определяем роль по email
      let role = 'student';
      if (email?.includes('teacher')) role = 'teacher';
      if (email?.includes('admin')) role = 'admin';

      const fakeJWT = `mock.${role}.token`;
      document.cookie = `jwt=${fakeJWT}; path=/; samesite=lax`;

      return new Response(
        JSON.stringify({ token: fakeJWT, user: { email, role } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /* ---------- REFRESH ---------- */
    if (path === '/api/auth/refresh') {
      await sleep(300);
      return new Response(null, { status: 204 });
    }

    /* ---------- ПРОЧИЕ ---------- */
    return originalFetch(url, options);
  };
}
