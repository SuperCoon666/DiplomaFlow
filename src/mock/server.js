/* Dev-mock для API. Подключается только при import.meta.env.DEV */

export function setupMockServer() {
  if (!import.meta.env.DEV) return;                   // в production не мешаемся

  const nativeFetch = window.fetch;
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  /* Хранилище версий в RAM */
  window._versions ||= { project: [], tech: [], pre: [] };

  /* Хранилище пользователей в RAM */
  window._users ||= [];

  /* Хранилище уведомлений в RAM */
  const LS_KEY = 'mock_notifs';
  window._notifications = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  const saveNotifs = () =>
    localStorage.setItem(LS_KEY, JSON.stringify(window._notifications));

  function generateNotifications(u){
    if (window._notifications[u.id]) return;
    const samples = [
      { type:'КРАЙНИЙ СРОК', msg:'Через три дня дедлайн по проектной практике' },
      { type:'КОММЕНТАРИЙ',  msg:'Руководитель прокомментировал вашу версию' },
      { type:'ОЦЕНКА',    msg:'Появилась итоговая оценка за тех.практику' },
      { type:'ДИПЛОМ',  msg:'Завтра консультация по дипломной работе' },
      { type:'ДОРАБОТКА',   msg:'Версия отправлена на доработку' },
      { type:'ПРИЁМ',        msg:'Руководитель принял вашу версию без правок' },
      { type:'СРОЧНО',       msg:'Срок сдачи отчёта истекает сегодня' },
      { type:'КОНСУЛЬТАЦИЯ', msg:'Запланирована консультация с руководителем завтра в 14:00' },
      { type:'ЗАЩИТА',       msg:'Назначена дата защиты диплома: 25.06.2025' },
      { type:'ФАЙЛ',         msg:'Рецензент загрузил файл с замечаниями' },
      { type:'ОТЧЁТ',        msg:'Доступна новая форма итогового отчёта по практике' },
      { type:'ПРОВЕРКА',     msg:'Версия отправлена на проверку рецензенту' },
      { type:'УТВЕРЖДЕНИЕ',  msg:'Тематика ВКР утверждена кафедрой' },
    ];
    const n = 3 + Math.floor(Math.random()*3);
    window._notifications[u.id] = Array.from({length:n}, (_,i)=>{
      const s = samples[Math.floor(Math.random()*samples.length)];
      return {
        id        : Date.now()+i,
        userId    : u.id,
        type      : s.type,
        message   : s.msg,
        status    : false,
        createdAt : Date.now()
      };
    });
    saveNotifs();
  }

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
      const { email, password, role = 'STUDENT' } = await read(opts.body);
      const userRole = role.toUpperCase();
      const user = {
        id          : Date.now(),
        email,
        name        : email.split('@')[0] || 'demo',
        role        : userRole,
        groupName   : userRole==='STUDENT' ? 'Б22-05' : '',
        supervisorId: userRole==='STUDENT' ? 100 : null
      };
      window._users.push(user);
      generateNotifications(user);
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

    /* ---------- NOTIFICATIONS ---------- */
    if (path === '/api/notifications' && opts.method === 'GET') {
      return new Response(
        JSON.stringify(window._notifications),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // GET /api/notifications/{userId}
    const mNotifList = path.match(/^\/api\/notifications\/(\d+)$/);
    if (mNotifList && (!opts.method || opts.method==='GET')) {
      const uid = +mNotifList[1];
      return new Response(
        JSON.stringify(window._notifications[uid] ?? []),
        { status:200, headers:{'Content-Type':'application/json'} }
      );
    }

    // PUT /api/notifications/{id}/read
    const mNotifRead = path.match(/^\/api\/notifications\/(\d+)\/read$/);
    if (mNotifRead && opts.method==='PUT') {
      const id = +mNotifRead[1];
      for (const arr of Object.values(window._notifications)){
        const n = arr.find(o=>o.id===id);
        if (n){
          n.status = true;
          saveNotifs();
          return new Response(
            JSON.stringify(n),
            { status:200, headers:{'Content-Type':'application/json'} }
          );
        }
      }
      return new Response('Not found',{status:404});
    }

    /* остальное — реальный fetch */
    return nativeFetch(url, opts);
  };
}
