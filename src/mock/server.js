/* Dev-mock для API. Подключается только при import.meta.env.DEV */

export function setupMockServer() {
  if (!import.meta.env.DEV) return;                   // в production не мешаемся

  const nativeFetch = window.fetch;
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  /* Хранилище версий в RAM */
  window._versions ||= { project: [], tech: [], pre: [] };

  /* -------- вспомогательное чтение body -------- */
  async function read(body) {
    if (!body) return {};
    if (typeof body === 'string')           return JSON.parse(body || '{}');
    if (body instanceof Blob)              return JSON.parse(await body.text());
    if (typeof body.text === 'function')    return JSON.parse(await body.text());
    // если body не строка и не Blob, возвращаем пустой объект
    return {};
  }

  /* ------------ patch fetch ------------ */
  window.fetch = async (url, opts = {}) => {
    const path = url.toString().replace(/^https?:\/\/[^/]+/, '');

    /* ---------- AUTH ---------- */
    if (path === '/api/auth/login' && opts.method === 'POST') {
      await wait(400);
      const { email } = await read(opts.body);
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

    if (path === '/api/auth/refresh') {
      await wait(150);
      return new Response(null, { status: 204 });
    }

    /* ---------- PRACTICE: список версий ---------- */
    const mList = path.match(/^\/api\/practice\/(project|tech|pre)\/versions$/);
    if (mList) {
      const type = mList[1];
      if (!opts.method || opts.method === 'GET')
        return new Response(
          JSON.stringify(window._versions[type] || []),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }

    /* ---------- PRACTICE: одна версия ---------- */
    const mOne = path.match(/^\/api\/practice\/(project|tech|pre)\/version\/(\d+)$/);
    if (mOne) {
      const [ , type, id ] = mOne;
      const v = (window._versions[type] || []).find(v => v.id === +id);
      if (!v)
        return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      if (typeof v.content !== 'string') v.content = '';
      return new Response(
        JSON.stringify(v),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /* ---------- PRACTICE: сохранить ---------- */
    const mSave = path.match(/^\/api\/practice\/(project|tech|pre)\/save$/);
    if (mSave && opts.method === 'POST') {
      const type = mSave[1];
      const { content } = await read(opts.body);
      const version = {
        id: Date.now(),
        createdAt: Date.now(),
        content: typeof content === 'string' ? content : '',
        status: 'draft' // новый статус по умолчанию
      };
      window._versions[type].unshift(version);
      return new Response(
        JSON.stringify(version),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /* ---------- PRACTICE: отправить на проверку ---------- */
    const mSend = path.match(/^\/api\/practice\/(project|tech|pre)\/send\/(\d+)$/);
    if (mSend && opts.method === 'POST') {
      const type = mSend[1];
      const id = +mSend[2];
      const v = window._versions[type].find(v => v.id === id);
      if (!v) return new Response('Not found', { status: 404 });
      v.status = 'pending';
      // имитация проверки через 2 секунды
      setTimeout(() => {
        v.status = Math.random() > 0.5 ? 'accepted' : 'rework';
      }, 2000);
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /* остальное — реальный fetch */
    return nativeFetch(url, opts);
  };
}
