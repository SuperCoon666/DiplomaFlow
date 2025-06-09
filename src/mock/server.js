/* Dev-mock для API. Подключается только при import.meta.env.DEV */

export function setupMockServer() {
  if (!import.meta.env.DEV) return;                   // в production не мешаемся

  const nativeFetch = window.fetch;
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  /* Хранилище версий в RAM */
  window._versions ||= { project: [], tech: [], pre: [] };

  /* Хранилище пользователей в RAM */
  window._users ||= [];

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

      // ищем или создаём пользователя
      let user = window._users.find(u => u.email === email);
      if (!user) {
        const id   = Date.now();
        const role = /teacher/.test(email) ? 'TEACHER'
                  : /admin/.test(email)   ? 'ADMIN'
                  :                          'STUDENT';
        const [namePart] = email.split('@');
        user = {
          id,
          name: namePart.replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),
          email,
          groupName   : role === 'STUDENT' ? 'Б22-05' : '',
          role,
          supervisorId: role === 'STUDENT' ? 100 : null
        };
        window._users.push(user);
      }

      const token = `mock.${user.role}.${user.id}`;
      document.cookie = `jwt=${token}; path=/; samesite=lax`;

      console.log('UserDto после логина:', user);

      return new Response(
        JSON.stringify({ token, user }),
        { status: 200, headers: { 'Content-Type':'application/json' } }
      );
    }

    if (path === '/api/auth/refresh') {
      await wait(150);
      return new Response(null, { status: 204 });
    }

    /* ---------- PRACTICE: список версий ---------- */
    const mList = path.match(/^\/api\/practice\/(project|tech|pre)\/versions$/);
    if (mList && (!opts.method || opts.method === 'GET')) {
      const type = mList[1];
      const arr = window._versions[type] || [];
      // Возвращаем только мета-данные (без content)
      const meta = arr.map(v => ({
        id: v.id,
        versionNumber: v.versionNumber,
        createdAt: v.createdAt,
        status: v.status
      }));
      return new Response(
        JSON.stringify(meta),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /* ---------- PRACTICE: одна версия ---------- */
    const mOne = path.match(/^\/api\/practice\/(project|tech|pre)\/version\/(\d+)$/);
    if (mOne && (!opts.method || opts.method === 'GET')) {
      const type = mOne[1];
      const id = +mOne[2];
      const arr = window._versions[type] || [];
      const v = arr.find(v => v.id === id);
      if (!v)
        return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      return new Response(
        JSON.stringify(v),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /* ---------- PRACTICE: сохранить ---------- */
    const mSave = path.match(/^\/api\/practice\/(project|tech|pre)\/save$/);
    if (mSave && opts.method === 'POST') {
      const type = mSave[1];
      const arr = window._versions[type];
      const { content } = await read(opts.body);
      const version = {
        id: Date.now(),
        versionNumber: arr.length + 1,
        createdAt: Date.now(),
        content,
        status: 'draft'
      };
      arr.unshift(version);
      console.log('window._versions после сохранения:', window._versions);
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
      const arr = window._versions[type];
      const v = arr.find(v => v.id === id);
      if (!v) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      v.status = 'pending';
      setTimeout(() => {
        v.status = Math.random() > 0.5 ? 'accepted' : 'rework';
      }, 2000);
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /* ---------- PRACTICE: создать новую практику ---------- */
    if (path === '/api/practices' && opts.method === 'POST') {
      const body = await read(opts.body);
      const id = Date.now();
      const practice = { ...body, id, lastModified: new Date().toISOString(), studentId: String(body.studentId) };
      window._practices.push(practice);
      window._versionsByPractice[id] = [];
      saveToLS();
      console.log('window._practices после создания:', window._practices);
      return new Response(
        JSON.stringify(practice),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    /* остальное — реальный fetch */
    return nativeFetch(url, opts);
  };
}
