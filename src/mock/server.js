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

  /* Хранилище студентов в RAM */
  window._students ||= {};

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
      { type:'ОТВЕТ СТУДЕНТА', msg:'Студент загрузил новую версию' },
      { type:'ЗАЯВКА НА ДИПЛОМ', msg:'Поступила заявка на тему ВКР' },
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
        createdAt : Date.now(),
        progress  : { project:45, tech:20, pre:0 }
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

      if (userRole === 'TEACHER' && !window._students[user.id]) {
        const groups = ['ИКБО-20-21','ИКБО-20-22'];
        window._students[user.id] = Array.from({length:8},(_,i)=>({
          id   : Date.now()+i,
          name : `Иванов Иван №${i+1}`,
          group: groups[i%groups.length],
          progress: { project:45, tech:20, pre:0 }
        }));
      }

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

      if (arr.length === 0) {
        const statuses = ['pending', 'accepted', 'rework', 'draft'];
        for (let i = 0; i < 3; i++) {
          arr.push({
            id: Date.now() + i,
            versionNumber: i + 1,
            createdAt: Date.now() - (3 - i) * 86400000,
            content: `<p>Это демо-версия №${i + 1} для <b>${type}</b> практики.</p>`,
            status: statuses[i % statuses.length],
            comment: i === 2 ? 'Нужно больше деталей в разделе 2.' : ''
          });
        }
        window._versions[type] = arr;
      }
      
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

    // GET /api/teacher/{tid}/students
    const mTeach = path.match(/^\/api\/teacher\/(\d+)\/students$/);
    if (mTeach && (!opts.method || opts.method === 'GET')) {
      const tid = +mTeach[1];

      // если ещё нет – сгенерируем демо-студентов
      if (!window._students[tid]) {
        const groups = ['ИКБО-20-21', 'ИКБО-20-22'];
        window._students[tid] = Array.from({ length: 8 }, (_, i) => ({
          id   : Date.now() + i,
          name : `Иванов Иван №${i + 1}`,
          group: groups[i % groups.length],
          progress: { project:45, tech:20, pre:0 }
        }));
      }

      return new Response(
        JSON.stringify(window._students[tid]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // GET /api/teacher/{tid}/reviews
    const mReviews = path.match(/^\/api\/teacher\/(\d+)\/reviews$/);
    if (mReviews && (!opts.method || opts.method === 'GET')) {
      const tid = +mReviews[1];
      window._reviews ||= {};
      if (!window._reviews[tid]) {
        window._reviews[tid] = [
          { name:'Иванов Иван №1', group:'ИКБО-20-21', practice:'Проектная практика',        type:'project' },
          { name:'Петров Пётр №2', group:'ИКБО-20-22', practice:'Технологическая практика',  type:'tech'    },
          { name:'Сидорова Анна №3', group:'ИКБО-20-21', practice:'Преддипломная практика', type:'pre'     },
        ];
      }
      return new Response(
        JSON.stringify(window._reviews[tid]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // GET /api/student/{sid}
    const mCard = path.match(/^\/api\/student\/(\d+)$/);
    if (mCard && (!opts.method || opts.method === 'GET')) {
      const sid = +mCard[1];
      window._studentCards ||= {};
      if (!window._studentCards[sid]) {
        const grp = sid % 2 ? 'ИКБО-20-21' : 'ИКБО-20-22';
        window._studentCards[sid] = {
          id:sid,
          name:`Иванов Иван №${sid%10}`,
          group:grp,
          topic:'Система организации выполнения ВКР студентов',
          progress:{ project:45, tech:20, pre:0 }
        };
      }
      return new Response(
        JSON.stringify(window._studentCards[sid]),
        { status:200, headers:{'Content-Type':'application/json'} }
      );
    }

    const mAccept = path.match(/^\/api\/practice\/(project|tech|pre)\/version\/(\d+)\/accept$/);
    if (mAccept && opts.method==='PUT'){
      const [ ,type,id ] = mAccept; const v=window._versions[type].find(v=>v.id==id);
      if(!v) return new Response('not found',{status:404});
      v.status='accepted'; return new Response(JSON.stringify(v),{status:200});
    }
    const mRework = path.match(/^\/api\/practice\/(project|tech|pre)\/version\/(\d+)\/rework$/);
    if (mRework && opts.method==='PUT'){
      const [ ,type,id ] = mRework; const v=window._versions[type].find(v=>v.id==id);
      if(!v) return new Response('not found',{status:404});
      const { comment='' } = await read(opts.body);
      v.status='rework'; v.comment=comment; return new Response(JSON.stringify(v),{status:200});
    }

    /* остальное — реальный fetch */
    return nativeFetch(url, opts);
  };
}
